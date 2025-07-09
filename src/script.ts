console.log("hi");

const startButton = document.getElementById('start') as HTMLButtonElement | null;
const quitButton = document.getElementById('quit') as HTMLButtonElement | null;

if (startButton) {
  startButton.addEventListener('click', () => {
    window.location.href = 'jeu.html';
  });
}

if (quitButton) {
  quitButton.addEventListener('click', () => {
    // window.close() ne fonctionne que si la fenêtre a été ouverte par script
    if (window.confirm('Quitter le jeu ?')) {
      window.open('', '_self')?.close();
    }
  });
}
