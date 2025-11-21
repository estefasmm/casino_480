import { Baraja } from '../common/Deck.js';
import { BlackjackPlayer } from './BlackjackPlayer.js';
/**
 * Manages the core logic and flow of a Blackjack game.
 * Integrates players, deck, and user interface to provide a complete game experience.
 */
export class BlackjackGame {
    constructor(ui, numeroJugadores, carteraInicial) {
        this.ui = ui;
        this.numeroJugadores = numeroJugadores;
        this.carteraInicial = carteraInicial;
        this.estado = 'APOSTANDO';
        this.baraja = new Baraja();
        this.jugadores = [];
        this.apuestaActual = 10;
        this.INCREMENTO_APUESTA = 10;
        this.jugadorActualIndex = 0;
        this.ui.crearAreasDeJugador(numeroJugadores);
        for (let i = 0; i < numeroJugadores; i++) {
            this.jugadores.push(new BlackjackPlayer(`Jugador ${i + 1}`, carteraInicial));
        }
        this.crupier = new BlackjackPlayer('Crupier', 0, true); // Dealer has no personal balance for betting
        this.ui.configurarBotones({
            nuevaRonda: () => this.nuevaRonda(),
            pedirCarta: () => this.pedirCarta(),
            plantarse: () => this.plantarse(),
            aumentarApuesta: () => this.aumentarApuesta(),
            disminuirApuesta: () => this.disminuirApuesta(),
            apostar: () => this.realizarApuesta(),
        });
        this.nuevaRonda(); // Start the first round
    }
    /**
     * Changes the current game state and updates the UI accordingly.
     * @param nuevoEstado The new game state.
     */
    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
        this.ui.gestionarVisibilidadBotones(this.estado);
    }
    /**
     * Starts a new round of Blackjack, resetting player hands, shuffling the deck,
     * and preparing the UI for betting.
     */
    nuevaRonda() {
        this.cambiarEstado('APOSTANDO');
        this.jugadores.forEach(j => j.reiniciarMano());
        this.crupier.reiniciarMano();
        this.baraja.reiniciar(); // Reset and shuffle the deck
        this.ui.limpiarTablero(this.numeroJugadores);
        this.ui.actualizarCarteras(this.jugadores.map(j => j.cartera));
        this.ui.actualizarApuesta(this.apuestaActual);
        this.ui.mostrarMensaje('Realiza tu apuesta para empezar la ronda.');
        this.jugadorActualIndex = 0; // Reset player turn
    }
    /**
     * Increases the current bet amount, if players have enough balance.
     */
    aumentarApuesta() {
        if (this.estado !== 'APOSTANDO')
            return;
        // Ensure all players can cover the increased bet
        if (this.apuestaActual + this.INCREMENTO_APUESTA <= Math.min(...this.jugadores.map(j => j.cartera))) {
            this.apuestaActual += this.INCREMENTO_APUESTA;
            this.ui.actualizarApuesta(this.apuestaActual);
        }
        else {
            this.ui.mostrarMensaje('No puedes aumentar la apuesta, algunos jugadores no tienen suficiente dinero.');
        }
    }
    /**
     * Decreases the current bet amount.
     */
    disminuirApuesta() {
        if (this.estado !== 'APOSTANDO')
            return;
        if (this.apuestaActual - this.INCREMENTO_APUESTA > 0) {
            this.apuestaActual -= this.INCREMENTO_APUESTA;
            this.ui.actualizarApuesta(this.apuestaActual);
        }
    }
    /**
     * Processes bets from all players and starts the game round.
     * Deals initial cards and checks for immediate Blackjacks.
     */
    realizarApuesta() {
        if (this.estado !== 'APOSTANDO')
            return;
        let todosPuedenApostar = true;
        this.jugadores.forEach(jugador => {
            if (!jugador.apostar(this.apuestaActual)) {
                todosPuedenApostar = false;
            }
        });
        if (!todosPuedenApostar) {
            this.ui.mostrarMensaje('Alguno de los jugadores no tiene suficiente dinero para la apuesta actual.');
            // Refund money to players who could afford it but the round didn't start
            this.jugadores.forEach(j => j.ganar(this.apuestaActual));
            this.ui.actualizarCarteras(this.jugadores.map(j => j.cartera));
            return;
        }
        this.cambiarEstado('JUGANDO');
        this.ui.actualizarCarteras(this.jugadores.map(j => j.cartera));
        this.ui.mostrarMensaje(`Turno del Jugador ${this.jugadorActualIndex + 1}. ¿Pedir carta o plantarse?`);
        // Deal initial two cards to each player and the dealer
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.jugadores.length; j++) {
                const card = this.baraja.robar();
                if (card)
                    this.jugadores[j].agregarCarta(card);
            }
            const dealerCard = this.baraja.robar();
            if (dealerCard)
                this.crupier.agregarCarta(dealerCard);
        }
        this.actualizarVista();
        this.comprobarBlackjackInicial();
    }
    /**
     * Proceeds to the next player's turn, or initiates the dealer's turn if all players have acted.
     */
    siguienteTurno() {
        // Find the next player who is still in the game (not busted and not stood)
        let nextPlayerFound = false;
        for (let i = this.jugadorActualIndex + 1; i < this.numeroJugadores; i++) {
            // A player is "done" with their turn if they have busted (score > 21) or already stood (implicitly by not having a turn)
            // For now, simpler: next player always gets a turn unless they busted.
            if (this.jugadores[i].puntuacion <= 21) {
                this.jugadorActualIndex = i;
                nextPlayerFound = true;
                this.ui.mostrarMensaje(`Turno del Jugador ${this.jugadorActualIndex + 1}. ¿Pedir carta o plantarse?`);
                if (this.jugadores[this.jugadorActualIndex].puntuacion === 21) {
                    // If next player has 21, automatically move to next or dealer
                    this.ui.mostrarMensaje(`Jugador ${this.jugadorActualIndex + 1} tiene 21! Pasando al siguiente.`);
                    this.siguienteTurno();
                }
                return; // Player turn handled, exit
            }
        }
        // If no more players, it's the dealer's turn
        this.turnoDelCrupier();
    }
    /**
     * Updates the UI to reflect the current state of hands and scores.
     * @param ocultarCartaCrupier If true, the dealer's first card is hidden.
     */
    actualizarVista(ocultarCartaCrupier = true) {
        this.ui.limpiarTablero(this.numeroJugadores); // Clear existing cards
        // Display player cards
        this.jugadores.forEach((jugador, i) => {
            jugador.mano.forEach((card, j) => {
                this.ui.mostrarCarta(card, i, false, false, j, jugador.mano.length);
            });
        });
        // Display dealer cards
        this.crupier.mano.forEach((card, i) => {
            // Hide the dealer's first card if ocultarCartaCrupier is true and it's the first card
            this.ui.mostrarCarta(card, -1, true, ocultarCartaCrupier && i === 0, i, this.crupier.mano.length);
        });
        // Determine dealer's displayed score (hide first card's value if hidden)
        const puntCrupierDisplay = ocultarCartaCrupier ? BlackjackPlayer.getBlackjackCardValue(this.crupier.mano[1]?.rango || '2') : this.crupier.puntuacion;
        this.ui.actualizarPuntuaciones(this.jugadores.map(j => j.puntuacion), puntCrupierDisplay);
    }
    /**
     * Player requests another card ("Hit").
     */
    pedirCarta() {
        if (this.estado !== 'JUGANDO')
            return;
        const jugadorActual = this.jugadores[this.jugadorActualIndex];
        const card = this.baraja.robar();
        if (card)
            jugadorActual.agregarCarta(card);
        this.actualizarVista();
        if (jugadorActual.puntuacion > 21) {
            this.ui.mostrarMensaje(`Jugador ${this.jugadorActualIndex + 1} se ha pasado con ${jugadorActual.puntuacion}!`);
            this.siguienteTurno(); // Move to next player or dealer
        }
    }
    /**
     * Player chooses to stop receiving cards ("Stand").
     */
    plantarse() {
        if (this.estado !== 'JUGANDO')
            return;
        this.ui.mostrarMensaje(`Jugador ${this.jugadorActualIndex + 1} se planta.`);
        this.siguienteTurno(); // Move to next player or dealer
    }
    /**
     * Checks if any players or the dealer have a natural Blackjack after initial deal.
     */
    comprobarBlackjackInicial() {
        let anyBlackjack = false;
        this.jugadores.forEach((jugador, i) => {
            if (jugador.puntuacion === 21 && jugador.mano.length === 2) {
                this.ui.mostrarMensaje(`¡Jugador ${i + 1} tiene Blackjack!`);
                anyBlackjack = true;
            }
        });
        if (this.crupier.puntuacion === 21 && this.crupier.mano.length === 2) {
            this.ui.mostrarMensaje('¡Crupier tiene Blackjack!');
            anyBlackjack = true;
        }
        // If any Blackjacks, move directly to dealer's turn (or end if only dealer has blackjack)
        // Simplified for now: if any blackjack, move to dealer's turn to resolve immediately.
        // More complex logic might handle player blackjacks differently (e.g., immediate payout)
        if (anyBlackjack) {
            this.turnoDelCrupier();
        }
    }
    /**
     * Executes the dealer's turn, hitting until score is 17 or higher.
     */
    async turnoDelCrupier() {
        this.cambiarEstado('FIN_RONDA');
        this.ui.mostrarMensaje('Turno del Crupier...');
        this.actualizarVista(false); // Show all dealer cards
        while (this.crupier.puntuacion < 17) {
            await this.sleep(1000); // Simulate delay
            const card = this.baraja.robar();
            if (card)
                this.crupier.agregarCarta(card);
            this.actualizarVista(false);
        }
        this.determinarGanadores(); // Resolve the round
    }
    /**
     * Determines the winner(s) of the round and updates player balances.
     */
    determinarGanadores() {
        const puntCrupier = this.crupier.puntuacion;
        let mensajeFinal = '';
        this.jugadores.forEach((jugador, i) => {
            const puntJugador = jugador.puntuacion;
            const esBlackjackJugador = puntJugador === 21 && jugador.mano.length === 2;
            const esBlackjackCrupier = puntCrupier === 21 && this.crupier.mano.length === 2;
            if (puntJugador > 21) {
                mensajeFinal += `${jugador.id}: Pierde. `; // Busted
            }
            else if (esBlackjackJugador && !esBlackjackCrupier) {
                jugador.ganar(this.apuestaActual * 2.5); // Blackjack pays 3:2 (1.5x original bet + original bet)
                mensajeFinal += `${jugador.id}: ¡Blackjack! Gana. `;
            }
            else if (puntCrupier > 21 || puntJugador > puntCrupier) {
                jugador.ganar(this.apuestaActual * 2); // Player wins, gets original bet + original bet
                mensajeFinal += `${jugador.id}: Gana. `;
            }
            else if (puntCrupier > puntJugador) {
                mensajeFinal += `${jugador.id}: Pierde. `; // Dealer wins
            }
            else if (puntJugador === puntCrupier) {
                jugador.ganar(this.apuestaActual); // Push, get original bet back
                mensajeFinal += `${jugador.id}: Empate. `;
            }
            else {
                // Should not happen, but for completeness
                mensajeFinal += `${jugador.id}: Resultado indefinido. `;
            }
        });
        this.finalizarRonda(mensajeFinal);
    }
    /**
     * Concludes the round, displays final messages, and updates UI.
     * Checks if all players are out of money.
     * @param mensaje The message summarizing the round's results.
     */
    finalizarRonda(mensaje) {
        this.cambiarEstado('FIN_RONDA');
        this.ui.mostrarMensaje(mensaje);
        this.ui.actualizarCarteras(this.jugadores.map(j => j.cartera));
        if (this.jugadores.every(j => j.cartera <= 0)) { // Changed to <= 0 to account for potentially negative balances if betting logic is changed
            this.ui.mostrarMensaje('Todos los jugadores se han quedado sin dinero. ¡Fin del juego!');
            // Optionally disable buttons or redirect
        }
    }
    /**
     * Utility function to pause execution for a given number of milliseconds.
     * @param ms The number of milliseconds to sleep.
     * @returns A Promise that resolves after the specified time.
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=BlackjackGame.js.map