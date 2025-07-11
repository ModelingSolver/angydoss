// TypeScript Game Logic

// Activation son au premier clic
function activerSon(): void {
  const iframe = document.getElementById('video') as HTMLIFrameElement | null;
  if (!iframe) return;

  if (iframe.src.includes('mute=1')) {
    iframe.src = iframe.src.replace('mute=1', 'mute=0');
  }

  document.removeEventListener('click', activerSon);
  document.removeEventListener('touchstart', activerSon);
}

document.addEventListener('click', activerSon);
document.addEventListener('touchstart', activerSon);


// Variables globales
const hero = document.getElementById('hero') as HTMLElement;
const heroEmojis: string[] = ['😠', '😑', '😃'];
let heroIndex = 0;
hero.textContent = heroEmojis[heroIndex];
let coeurs: Coeur[] = [];
let niveau: number = 1;
let chrono: number = 5;
let timer: number | undefined;
let gameIntervals: number[] = [];


// Classe Coeur
class Coeur {
  element: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('coeur');
    this.element.textContent = '❤️';

    const container = document.getElementById('game-container')!;
    container.appendChild(this.element);
    const rect = container.getBoundingClientRect();

    this.x = Math.random() * (rect.width - 50);
    this.y = Math.random() * (rect.height - 50);
    this.vx = (Math.random() - 0.5) * 16;
    this.vy = (Math.random() - 0.5) * 16;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.addEventListener('click', () => {
      this.element.remove();
      coeurs = coeurs.filter(c => c !== this);
      if (coeurs.length === 0) niveauSuivant();
    });
  }

  deplacer(): void {
    this.x += this.vx;
    this.y += this.vy;

    const rect = (document.getElementById('game-container') as HTMLElement).getBoundingClientRect();

    if (this.x <= -10 || this.x >= rect.width - 55) this.vx *= -1;
    if (this.y <= -10 || this.y >= rect.height - 50) this.vy *= -1;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}


// Fonctions principales
function creerCoeurs(n: number): void {
  coeurs.forEach(c => c.element.remove());
  coeurs = [];
  for (let i = 0; i < n; i++) {
    coeurs.push(new Coeur());
  }
}

function deplacerCoeurs(): void {
  coeurs.forEach(c => c.deplacer());
}

function detecterCollisions(): void {
  coeurs.forEach((coeur) => {
    const heroRect = hero.getBoundingClientRect();
    const coeurRect = coeur.element.getBoundingClientRect();

    const collision =
      heroRect.x < coeurRect.x + coeurRect.width &&
      heroRect.x + heroRect.width > coeurRect.x &&
      heroRect.y < coeurRect.y + coeurRect.height &&
      heroRect.y + heroRect.height > coeurRect.y;

    if (collision) {
      coeur.element.remove();
      coeurs = coeurs.filter(c => c !== coeur);

      heroIndex = (heroIndex + 1) % heroEmojis.length;
      hero.textContent = heroEmojis[heroIndex];

      if (heroIndex === 2) {
        hero.style.fontSize = '200px';
        gameOver();
      }

      if (coeurs.length === 0) niveauSuivant();
    }
  });
}

function clearGameIntervals(): void {
  gameIntervals.forEach(id => clearInterval(id));
  gameIntervals = [];
}

function niveauSuivant(): void {
  clearGameIntervals();
  niveau++;

  const levelScreen = document.getElementById('level-screen')!;
  levelScreen.style.display = 'block';

  setTimeout(() => {
    levelScreen.style.display = 'none';
    startGame();
  }, 2000);
}

function gameOver(): void {
  clearGameIntervals();
  window.location.href = './src/gameOver.html';
}

function startGame(): void {
  creerCoeurs(5 * niveau);
  chrono = 5;
  heroIndex = 0;
  hero.textContent = heroEmojis[heroIndex];
  hero.style.fontSize = '100px';
  hero.style.display = 'block';

  const chronoDiv = document.getElementById('chrono')!;
  chronoDiv.textContent = chrono.toString();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    chrono--;
    chronoDiv.textContent = chrono.toString();
    if (chrono === 0) {
      clearInterval(timer);
      jeu();
    }
  }, 1000);
}

function jeu(): void {
  clearGameIntervals();
  gameIntervals.push(setInterval(deplacerCoeurs, 16));
  gameIntervals.push(setInterval(detecterCollisions, 16));
}


// Mouvement du héros
function addHeroMovement(): void {
  let isDragging = false;
  hero.style.position = 'absolute';
  hero.style.width = '80px';
  hero.style.height = '80px';

  hero.addEventListener('mousedown', () => {
    isDragging = true;
    hero.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    hero.style.cursor = 'grab';
  });

  document.addEventListener('mousemove', (event) => {
    const maxWidth = window.innerWidth - hero.offsetWidth;
    const maxHeight = window.innerHeight - hero.offsetHeight;

    if (isDragging) {
      const offsetX = hero.offsetWidth * 0.5;
      const offsetY = hero.offsetHeight * 0.5;
      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;

      if (newX < -12) newX = -12;
      if (newX > maxWidth - 40) newX = maxWidth - 40;
      if (newY < -20) newY = -20;
      if (newY > maxHeight - 42) newY = maxHeight - 42;

      hero.style.left = `${newX}px`;
      hero.style.top = `${newY}px`;
    }
  });
}


// Game Loop
addHeroMovement();
startGame();
