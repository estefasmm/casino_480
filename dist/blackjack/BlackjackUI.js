/**
 * Manages the User Interface for the Blackjack game.
 * Handles rendering cards, updating scores, managing player areas,
 * and controlling button visibility based on game state.
 */
export class BlackjackUI {
    constructor() {
        this.crupierCartasDiv = document.getElementById('dealer-cards');
        this.crupierPuntuacionSpan = document.getElementById('dealer-score');
        this.playersContainer = document.getElementById('players-container');
        this.mensajesDiv = document.getElementById('messages');
        // Buttons
        this.nuevaRondaButton = document.getElementById('new-round-button');
        this.pedirCartaButton = document.getElementById('hit-button');
        this.plantarseButton = document.getElementById('stand-button');
        this.aumentarApuestaButton = document.getElementById('increase-bet-button');
        this.disminuirApuestaButton = document.getElementById('decrease-bet-button');
        this.apostarButton = document.getElementById('bet-button');
    }
    /**
     * Creates and displays player areas in the UI.
     * @param numeroJugadores The number of players to create areas for.
     */
    crearAreasDeJugador(numeroJugadores) {
        this.playersContainer.innerHTML = '';
        for (let i = 0; i < numeroJugadores; i++) {
            const playerArea = document.createElement('div');
            playerArea.classList.add('player-area');
            playerArea.id = `player-area-${i}`;
            playerArea.innerHTML = `
                <h2>Jugador ${i + 1}: <span id="player-score-${i}">0</span></h2>
                <div id="player-cards-${i}" class="card-area"></div>
                <div class="balance">Cartera: $<span id="player-balance-${i}">0</span></div>
            `;
            this.playersContainer.appendChild(playerArea);
        }
    }
    /**
     * Displays a card on the table for a player or the dealer.
     * @param carta The card to display.
     * @param jugadorIndex The index of the player (or -1 for dealer).
     * @param esCrupier True if the card is for the dealer.
     * @param oculta True if the card should be face down.
     * @param indice The index of the card in the hand for styling purposes.
     * @param totalCartas The total number of cards in the hand for styling purposes.
     */
    mostrarCarta(carta, jugadorIndex, esCrupier, oculta = false, indice = 0, totalCartas = 1) {
        const contenedor = esCrupier ? this.crupierCartasDiv : document.getElementById(`player-cards-${jugadorIndex}`);
        const cartaImg = document.createElement('img');
        cartaImg.classList.add('card');
        cartaImg.src = oculta ? 'assets/Baraja/atras.png' : carta.getImagen();
        const anguloPorCarta = 5;
        const angulo = (indice - (totalCartas - 1) / 2) * anguloPorCarta;
        const desplazamientoX = (indice - (totalCartas - 1) / 2) * 50;
        const transformacionBase = `rotate(${angulo}deg) translateX(${desplazamientoX}px)`;
        cartaImg.style.transform = transformacionBase;
        if (!esCrupier && !oculta) {
            cartaImg.addEventListener('mouseenter', () => {
                cartaImg.style.transform = `${transformacionBase} translateY(-20px) scale(1.1)`;
                cartaImg.style.zIndex = '100';
            });
            cartaImg.addEventListener('mouseleave', () => {
                cartaImg.style.transform = transformacionBase;
                cartaImg.style.zIndex = indice.toString();
            });
        }
        if (oculta)
            cartaImg.classList.add('hidden');
        contenedor.appendChild(cartaImg);
    }
    /**
     * Updates the displayed scores for players and the dealer.
     * @param puntuaciones An array of player scores.
     * @param puntuacionCrupier The dealer's score.
     */
    actualizarPuntuaciones(puntuaciones, puntuacionCrupier) {
        puntuaciones.forEach((puntuacion, i) => {
            const jugadorPuntuacionSpan = document.getElementById(`player-score-${i}`);
            jugadorPuntuacionSpan.textContent = puntuacion.toString();
        });
        this.crupierPuntuacionSpan.textContent = puntuacionCrupier.toString();
    }
    /**
     * Updates the displayed balances for players.
     * @param carteras An array of player balances.
     */
    actualizarCarteras(carteras) {
        carteras.forEach((cartera, i) => {
            const carteraSpan = document.getElementById(`player-balance-${i}`);
            carteraSpan.textContent = cartera.toString();
        });
    }
    /**
     * Updates the displayed current bet amount.
     * @param apuesta The current bet amount.
     */
    actualizarApuesta(apuesta) {
        const apuestaActualSpan = document.getElementById('current-bet');
        apuestaActualSpan.textContent = apuesta.toString();
    }
    /**
     * Displays a message to the user.
     * @param mensaje The message to display.
     */
    mostrarMensaje(mensaje) { this.mensajesDiv.textContent = mensaje; }
    /**
     * Clears the card areas and messages, and resets scores to zero.
     * @param numeroJugadores The number of players to clear areas for.
     */
    limpiarTablero(numeroJugadores) {
        this.crupierCartasDiv.innerHTML = '';
        for (let i = 0; i < numeroJugadores; i++) {
            const playerCardsDiv = document.getElementById(`player-cards-${i}`);
            playerCardsDiv.innerHTML = '';
        }
        this.mensajesDiv.textContent = '';
        this.actualizarPuntuaciones(Array(numeroJugadores).fill(0), 0);
    }
    /**
     * Configures event listeners for the game buttons.
     * @param handlers An object mapping button names to their event handler functions.
     */
    configurarBotones(handlers) {
        this.nuevaRondaButton.addEventListener('click', handlers.nuevaRonda);
        this.pedirCartaButton.addEventListener('click', handlers.pedirCarta);
        this.plantarseButton.addEventListener('click', handlers.plantarse);
        this.aumentarApuestaButton.addEventListener('click', handlers.aumentarApuesta);
        this.disminuirApuestaButton.addEventListener('click', handlers.disminuirApuesta);
        this.apostarButton.addEventListener('click', handlers.apostar);
    }
    /**
     * Manages the visibility and enabled state of game control buttons
     * based on the current game state.
     * @param estado The current state of the Blackjack game.
     */
    gestionarVisibilidadBotones(estado) {
        const apostando = estado === 'APOSTANDO';
        const jugando = estado === 'JUGANDO';
        const finRonda = estado === 'FIN_RONDA';
        const bettingArea = this.apostarButton.closest('.betting-area');
        const actionsArea = this.pedirCartaButton.closest('.actions');
        if (bettingArea)
            bettingArea.style.display = apostando ? 'block' : 'none';
        if (actionsArea)
            actionsArea.style.display = (jugando || finRonda) ? 'block' : 'none';
        this.pedirCartaButton.style.display = jugando ? 'inline-block' : 'none';
        this.plantarseButton.style.display = jugando ? 'inline-block' : 'none';
        this.nuevaRondaButton.style.display = finRonda ? 'inline-block' : 'none';
        this.pedirCartaButton.disabled = !jugando;
        this.plantarseButton.disabled = !jugando;
        this.nuevaRondaButton.disabled = !finRonda;
    }
}
//# sourceMappingURL=BlackjackUI.js.map