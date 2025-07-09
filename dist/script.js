"use strict";
console.log("hi");
const startButton = document.getElementById('start');
const quitButton = document.getElementById('quit');
if (startButton) {
    startButton.addEventListener('click', () => {
        window.location.href = 'jeu.html';
    });
}
if (quitButton) {
    quitButton.addEventListener('click', () => {
        var _a;
        // window.close() ne fonctionne que si la fenêtre a été ouverte par script
        if (window.confirm('Quitter le jeu ?')) {
            (_a = window.open('', '_self')) === null || _a === void 0 ? void 0 : _a.close();
        }
    });
}
