
type JuegoSeleccionado = 'BlackJack' | 'Poker';

class LandingPage {
    private blackjackOption = document.getElementById('blackjack-option') as HTMLButtonElement;
    private pokerOption = document.getElementById('poker-option') as HTMLButtonElement;
    private balanceInput = document.getElementById('balance-input') as HTMLInputElement;
    private playerCountInput = document.getElementById('player-count-input') as HTMLSelectElement;
    private playerNameInput = document.getElementById('player-name-input') as HTMLInputElement;
    private languageSelect = document.getElementById('language-select') as HTMLSelectElement;
    private startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;

    private juegoSeleccionado: JuegoSeleccionado = 'BlackJack';

    constructor() {
        this.configurarOpcionesJuego();
        this.configurarBotonInicio();
        this.configurarSelectorIdioma();
    }

    private configurarSelectorIdioma(): void {
        // Map language code -> color (text color for selector)
        const colorMap: { [key: string]: string } = {
            es: '#ffd700',    // Español - gold
            en: '#00bfff',    // English - skyblue
            pt: '#32cd32',    // Português - green
            it: '#ff8c00',    // Italiano - orange
            fr: '#6495ed',    // Français - cornflower
            de: '#d2691e',    // Deutsch - chocolate
            nl: '#ff69b4'     // Nederlands - hotpink
        };

        if (!this.languageSelect) return;

        const applyColor = () => {
            const val = (this.languageSelect.value || 'es').toString().slice(0,2).toLowerCase();
            const color = colorMap[val] || '#ffd700';
            (this.languageSelect as HTMLSelectElement).style.color = color;
            (this.languageSelect as HTMLSelectElement).style.borderColor = color;
        };

        this.languageSelect.addEventListener('change', applyColor);
        // Apply initial color
        applyColor();
    }

    private configurarOpcionesJuego(): void {
        this.blackjackOption.addEventListener('click', () => this.seleccionarJuego('BlackJack'));
        this.pokerOption.addEventListener('click', () => this.seleccionarJuego('Poker'));
    }

    private seleccionarJuego(juego: JuegoSeleccionado): void {
        this.juegoSeleccionado = juego;
        this.blackjackOption.classList.toggle('selected', juego === 'BlackJack');
        this.pokerOption.classList.toggle('selected', juego === 'Poker');
    }

    private configurarBotonInicio(): void {
        this.startGameButton.addEventListener('click', () => {
            const saldoInicial = parseInt(this.balanceInput.value, 10);
            const numeroJugadores = parseInt(this.playerCountInput.value, 10);
            const nombre = (this.playerNameInput && this.playerNameInput.value) ? this.playerNameInput.value.trim() : '';
            const lang = (this.languageSelect && this.languageSelect.value) ? this.languageSelect.value : 'es';

            if (isNaN(saldoInicial) || saldoInicial <= 0) {
                alert('Por favor, introduce un saldo inicial válido.');
                return;
            }

            if (this.juegoSeleccionado === 'BlackJack') {
                const nombreParam = nombre ? `&nombre=${encodeURIComponent(nombre)}` : '';
                const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : '';
                window.location.href = `blackjack.html?saldo=${saldoInicial}&jugadores=${numeroJugadores}${nombreParam}${langParam}`;
            } else {
                const nombreParam = nombre ? `&nombre=${encodeURIComponent(nombre)}` : '';
                const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : '';
                window.location.href = `poker.html?saldo=${saldoInicial}&jugadores=${numeroJugadores}${nombreParam}${langParam}`;
            }
        });
    }
}


// --- PUNTO DE ENTRADA DE LA APP ---

document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
});
