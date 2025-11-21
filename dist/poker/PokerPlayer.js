import { Jugador } from '../common/Player.js';
/**
 * Represents a Poker player, extending the generic Player class.
 * Includes properties for the player's balance and methods for betting.
 */
export class PokerPlayer extends Jugador {
    constructor(id, carteraInicial) {
        super(id); // Call the constructor of the base Jugador class
        this.cartera = carteraInicial;
    }
    /**
     * Attempts to place a bet.
     * @param cantidad The amount to bet.
     * @returns True if the bet was successful, false otherwise (insufficient funds).
     */
    apostar(cantidad) {
        if (cantidad > this.cartera)
            return false;
        this.cartera -= cantidad;
        return true;
    }
    /**
     * Adds winnings to the player's balance.
     * @param cantidad The amount won.
     */
    ganar(cantidad) {
        this.cartera += cantidad;
    }
}
//# sourceMappingURL=PokerPlayer.js.map