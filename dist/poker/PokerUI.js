/**
 * Manages the User Interface for the Poker game.
 * Handles rendering player areas, community cards, and updating game information like the pot.
 */
export class PokerUI {
    constructor() {
        this.playersContainer = document.getElementById('players-container');
        this.communityCardsContainer = document.getElementById('community-cards');
        this.potDiv = document.getElementById('pot');
        this.mensajesDiv = document.getElementById('messages'); // Assuming a messages div exists in poker.html
        // Additional UI methods for Poker actions (betting, checking, folding) would go here.
    }
    /**
     * Creates and displays player areas on the table in a circular layout.
     * @param players The array of PokerPlayer instances.
     */
    crearAreasDeJugador(players) {
        this.playersContainer.innerHTML = ''; // Clear existing player areas
        const numJugadores = players.length;
        const radio = 300; // Radius for the circular arrangement
        const centroX = this.playersContainer.offsetWidth / 2;
        const centroY = this.playersContainer.offsetHeight / 2;
        players.forEach((player, i) => {
            const angulo = (i / numJugadores) * 2 * Math.PI; // Angle for each player
            const x = centroX + radio * Math.cos(angulo) - 60; // Calculate X position, adjust for div width
            const y = centroY + radio * Math.sin(angulo) - 50; // Calculate Y position, adjust for div height
            const playerArea = document.createElement('div');
            playerArea.classList.add('player-area-poker');
            playerArea.id = `player-area-${i}`;
            playerArea.style.left = `${x}px`;
            playerArea.style.top = `${y}px`;
            playerArea.innerHTML = `
                <div class="player-name">${player.id}</div> 
                <div class="player-balance">$${player.cartera}</div>
                <div id="player-cards-${i}" class="player-cards"></div>
            `;
            this.playersContainer.appendChild(playerArea);
        });
    }
    /**
     * Displays a card, either to a player's hand or as a community card, with an animation.
     * @param card The card to display.
     * @param playerIndex The index of the player, or -1 for community cards.
     * @param isCommunity True if the card is a community card.
     * @param cardCountInHand The current count of cards in the hand (for animation timing).
     */
    repartirCarta(card, playerIndex, isCommunity, cardCountInHand) {
        const contenedor = isCommunity ? this.communityCardsContainer : document.getElementById(`player-cards-${playerIndex}`);
        const cardImg = document.createElement('img');
        cardImg.classList.add('card');
        cardImg.src = card.getImagen();
        // Deal animation
        cardImg.style.opacity = '0';
        cardImg.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            cardImg.style.opacity = '1';
            cardImg.style.transform = 'translateY(0)';
        }, (playerIndex * 100) + (cardCountInHand * 50)); // Simple staggered animation
        contenedor.appendChild(cardImg);
    }
    /**
     * Updates the displayed pot amount.
     * @param pot The current pot value.
     */
    actualizarBote(pot) {
        this.potDiv.textContent = `Bote: $${pot}`;
    }
    /**
     * Displays a message to the user.
     * @param message The message to display.
     */
    mostrarMensaje(message) {
        this.mensajesDiv.textContent = message;
    }
    /**
     * Clears all player hands and community cards from the UI.
     * @param numPlayers The number of players whose hands need to be cleared.
     */
    limpiarTablero(numPlayers) {
        this.communityCardsContainer.innerHTML = '';
        for (let i = 0; i < numPlayers; i++) {
            const playerCardsDiv = document.getElementById(`player-cards-${i}`);
            if (playerCardsDiv)
                playerCardsDiv.innerHTML = '';
        }
        this.mensajesDiv.textContent = ''; // Clear messages too
    }
}
//# sourceMappingURL=PokerUI.js.map