import { BlackjackGame } from './blackjack/BlackjackGame.js';
import { BlackjackUI } from './blackjack/BlackjackUI.js';
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const saldoInicial = parseInt(urlParams.get('saldo') || '1000', 10);
    const numeroJugadores = parseInt(urlParams.get('jugadores') || '1', 10);
    // Instantiate UI and Game classes
    const blackjackUI = new BlackjackUI();
    new BlackjackGame(blackjackUI, numeroJugadores, saldoInicial);
});
//# sourceMappingURL=blackjack.js.map