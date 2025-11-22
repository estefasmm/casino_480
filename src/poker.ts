import { PokerGame } from './poker/PokerGame.js';
import { PokerUI } from './poker/PokerUI.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const saldoInicial = parseInt(urlParams.get('saldo') || '1000', 10);
    const numeroJugadores = parseInt(urlParams.get('jugadores') || '2', 10);
    const lang = urlParams.get('lang') || 'es';

    // Instantiate UI and Game classes
    const pokerUI = new PokerUI();
    new PokerGame(pokerUI, numeroJugadores, saldoInicial, lang);
});
