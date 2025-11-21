/**
 * Represents a playing card with a suit, rank, and a numerical value.
 * This class provides basic card properties and a method to get its image path.
 */
export class Carta {
    constructor(palo, rango) {
        this.palo = palo;
        this.rango = rango;
    }
    /**
     * Returns the relative path to the card's image asset.
     * @returns {string} The image path.
     */
    getImagen() {
        // Assuming image assets are structured as 'assets/Baraja/[palo]_[rango].png'
        return `assets/Baraja/${this.palo}_${this.rango}.png`;
    }
    /**
     * Returns a string representation of the card (e.g., "as de corazones").
     * @returns {string} The card's description.
     */
    toString() {
        return `${this.rango} de ${this.palo}`;
    }
}
//# sourceMappingURL=Card.js.map