import { Baraja } from '../common/Deck.js';
import { PokerPlayer } from './PokerPlayer.js';
/**
 * Manages the core logic and flow of a Poker game (simplified Texas Hold'em).
 * Integrates players, deck, and user interface.
 */
export class PokerGame {
    constructor(ui, numeroJugadores, carteraInicial) {
        this.ui = ui;
        this.baraja = new Baraja();
        this.jugadores = [];
        this.cartasComunitarias = [];
        this.bote = 0;
        this.estado = 'PRE_FLOP'; // Initial game state
        this.NUM_CARTAS_INICIALES_JUGADOR = 2;
        this.NUM_CARTAS_FLOP = 3;
        this.NUM_CARTAS_TURN_RIVER = 1;
        for (let i = 0; i < numeroJugadores; i++) {
            this.jugadores.push(new PokerPlayer(`Jugador ${i + 1}`, carteraInicial));
        }
        this.ui.crearAreasDeJugador(this.jugadores);
        this.iniciarRonda();
    }
    /**
     * Determines the Poker-specific numeric value of a card's rank.
     * Aces are high (14) for hand evaluation.
     * @param rango The rank of the card.
     * @returns The Poker value of the card.
     */
    static getPokerCardValue(rango) {
        if (rango === 'as')
            return 14; // Ace is high
        if (rango === 'k')
            return 13;
        if (rango === 'q')
            return 12;
        if (rango === 'j')
            return 11;
        return parseInt(rango);
    }
    /**
     * Starts a new round of Poker, resetting hands, shuffling the deck,
     * and dealing initial cards.
     */
    iniciarRonda() {
        this.baraja.reiniciar(); // Resets and shuffles the deck
        this.jugadores.forEach(j => j.reiniciarMano());
        this.cartasComunitarias = [];
        this.bote = 0;
        this.ui.actualizarBote(this.bote);
        this.ui.limpiarTablero(this.jugadores.length); // Clear UI for new round
        this.estado = 'PRE_FLOP'; // Reset state
        // Deal initial cards to players
        for (let i = 0; i < this.NUM_CARTAS_INICIALES_JUGADOR; i++) {
            this.jugadores.forEach((jugador, playerIndex) => {
                const card = this.baraja.robar();
                if (card) {
                    jugador.agregarCarta(card);
                    this.ui.repartirCarta(card, playerIndex, false, i); // Display player card
                }
            });
        }
        this.ui.actualizarBote(this.bote); // Update pot with blinds/antes (not implemented yet)
        // For simplicity, automatically progress through stages for now
        setTimeout(() => this.repartirFlop(), 2000);
    }
    /**
     * Deals the Flop (first three community cards).
     */
    repartirFlop() {
        this.estado = 'FLOP';
        for (let i = 0; i < this.NUM_CARTAS_FLOP; i++) {
            const card = this.baraja.robar();
            if (card) {
                this.cartasComunitarias.push(card);
                this.ui.repartirCarta(card, -1, true, i); // Display community card (-1 for no player index)
            }
        }
        setTimeout(() => this.repartirTurn(), 2000);
    }
    /**
     * Deals the Turn (fourth community card).
     */
    repartirTurn() {
        this.estado = 'TURN';
        const card = this.baraja.robar();
        if (card) {
            this.cartasComunitarias.push(card);
            this.ui.repartirCarta(card, -1, true, this.cartasComunitarias.length - 1); // Display community card
        }
        setTimeout(() => this.repartirRiver(), 2000);
    }
    /**
     * Deals the River (fifth and final community card).
     */
    repartirRiver() {
        this.estado = 'RIVER';
        const card = this.baraja.robar();
        if (card) {
            this.cartasComunitarias.push(card);
            this.ui.repartirCarta(card, -1, true, this.cartasComunitarias.length - 1); // Display community card
        }
        setTimeout(() => this.showdown(), 2000);
    }
    /**
     * Conducts the showdown, determining the winner(s) based on hand rankings.
     * (Simplified: no actual hand ranking logic yet, just a placeholder)
     */
    showdown() {
        this.estado = 'SHOWDOWN';
        this.ui.actualizarBote(this.bote); // Ensure final pot is displayed before winner takes it
        this.ui.mostrarMensaje('¡Hora de la verdad! Determinando ganador...');
        // --- Placeholder for actual Poker hand evaluation logic ---
        // In a real game, each player's best 5-card hand (from their 2 hole cards + 5 community cards)
        // would be evaluated and compared using standard poker hand rankings.
        // For this refactoring, we'll just declare a random winner or the first player for now.
        const winnerIndex = Math.floor(Math.random() * this.jugadores.length);
        const winner = this.jugadores[winnerIndex];
        winner.ganar(this.bote); // Winner takes the pot
        this.bote = 0; // Pot is cleared after distribution
        this.ui.actualizarBote(this.bote); // Update UI to show empty pot
        this.ui.mostrarMensaje(`¡${winner.id} gana la ronda con el bote de $${this.bote}!`);
        this.estado = 'FIN_RONDA';
        // Allow for a new round
        setTimeout(() => this.iniciarRonda(), 5000);
    }
}
//# sourceMappingURL=PokerGame.js.map