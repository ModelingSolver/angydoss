// FOND VIDEO Activation son au premier clic:
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


// VARIABLES
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
      removeCoeur(this);
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


// évite les doublons, garde le jeu propre:
function removeCoeur(coeur: Coeur): void {
  coeur.element.remove();
  coeurs = coeurs.filter(c => c !== coeur);
}
//Nettoyage des intervalles actifs (déplacement, collision, etc.):
function clearGameIntervals(): void {
  gameIntervals.forEach(id => clearInterval(id));
  gameIntervals = [];
}


// Fonctions creer Coeurs & Deplacement Coeurs:
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


// MOUVEMENT HERO:
function addHeroMovement(): void {
  let isDragging = false;
  hero.style.position = 'absolute';
  hero.style.width = '80px';
  hero.style.height = '80px';

  hero.addEventListener('mousedown', startDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('mousemove', dragHero);

  function startDrag() {
    isDragging = true;
    hero.style.cursor = 'grabbing';
  }

  function stopDrag() {
    isDragging = false;
    hero.style.cursor = 'grab';
  }

  function dragHero(event: MouseEvent) {
    if (!isDragging) return;

    const offsetX = hero.offsetWidth * 0.5;
    const offsetY = hero.offsetHeight * 0.5;

    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    const maxWidth = window.innerWidth - hero.offsetWidth;
    const maxHeight = window.innerHeight - hero.offsetHeight;

    if (newX < -12) newX = -12;
    if (newX > maxWidth - 40) newX = maxWidth - 40;
    if (newY < -20) newY = -20;
    if (newY > maxHeight - 42) newY = maxHeight - 42;

    hero.style.left = `${newX}px`;
    hero.style.top = `${newY}px`;
  }
}

//COLLISIONS:
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
      removeCoeur(coeur);

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

//NEXT LVL:
function niveauSuivant(): void {
  niveau++;
  const levelScreen = document.getElementById('level-screen')!;
  levelScreen.style.display = 'block';

  setTimeout(() => {
    levelScreen.style.display = 'none';
    startGame();
  }, 2000);
}

//GAME OVER:
function gameOver(): void {
  window.location.href = './src/gameOver.html';
}

//TIMER:
function startCountdown(callback: () => void): void {
  const chronoDiv = document.getElementById('chrono')!;
  chrono = 5;
  chronoDiv.textContent = chrono.toString();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    chrono--;
    chronoDiv.textContent = chrono.toString();
    if (chrono === 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

//START GAME:
function startGame(): void {
  creerCoeurs(5 * niveau);
  heroIndex = 0;
  hero.textContent = heroEmojis[heroIndex];
  hero.style.fontSize = '100px';
  hero.style.display = 'block';

  startCountdown(jeu);
}

//DEPLACEMENT COEURS ET COLLISIONS:
function jeu(): void {
  clearGameIntervals();
  gameIntervals.push(setInterval(deplacerCoeurs, 16));
  gameIntervals.push(setInterval(detecterCollisions, 16));
}


// Game Loop
addHeroMovement();
startGame();

