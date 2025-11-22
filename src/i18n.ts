const translations: { [lang: string]: { [key: string]: string } } = {
    es: {
        'bet.place_prompt': 'Realiza tu apuesta para empezar la ronda.',
        'bet.cannot_increase': 'No puedes aumentar la apuesta, algunos jugadores no tienen suficiente dinero.',
        'bet.human_insufficient': 'No tienes suficiente dinero para la apuesta actual.',
        'turn.player_prompt': 'Turno del Jugador {index}. ¿Pedir carta o plantarse?',
        'player.busted': 'Jugador {index} se ha pasado con {score}!',
        'player.stand': 'Jugador {index} se planta.',
        'player.blackjack': '¡Jugador {index} tiene Blackjack!',
        'dealer.blackjack': '¡Crupier tiene Blackjack!',
        'turn.dealer': 'Turno del Crupier...',
        'round.finished_all_out': 'Todos los jugadores se han quedado sin dinero. ¡Fin del juego!',
        'result.win': '{name}: Gana.',
        'result.lose': '{name}: Pierde.',
        'result.push': '{name}: Empate.',
        'poker.showdown': '¡Hora de la verdad! Determinando ganador...',
        'poker.winner': '¡{name} gana la ronda con el bote de ${amount}!',
    },
    en: {
        'bet.place_prompt': 'Place your bet to start the round.',
        'bet.cannot_increase': "You can't increase the bet; some players don't have enough money.",
        'bet.human_insufficient': "You don't have enough money for the current bet.",
        'turn.player_prompt': 'Player {index} turn. Hit or Stand?',
        'player.busted': 'Player {index} busted with {score}!',
        'player.stand': 'Player {index} stands.',
        'player.blackjack': 'Player {index} has Blackjack!',
        'dealer.blackjack': 'Dealer has Blackjack!',
        'turn.dealer': "Dealer's turn...",
        'round.finished_all_out': 'All players are out of money. Game over!',
        'result.win': '{name}: Wins.',
        'result.lose': '{name}: Loses.',
        'result.push': '{name}: Push.',
        'poker.showdown': 'Showdown! Determining winner...',
        'poker.winner': '{name} wins the round with the pot of ${amount}!',
    }
};

function t(lang: string, key: string, params?: { [k: string]: string | number }): string {
    const map = translations[lang] || translations['es'];
    let template = map[key] || key;
    if (!params) return template;
    Object.keys(params).forEach(k => {
        template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
    });
    return template;
}

export { t };
