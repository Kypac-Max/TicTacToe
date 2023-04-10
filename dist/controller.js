import Model from './model.js';
import View from './view.js';
const players = [
    {
        id: 1,
        name: 'Player 1',
        iconClass: 'fa-x',
        colorClass: 'turquoise',
    },
    {
        id: 2,
        name: 'Player 2',
        iconClass: 'fa-o',
        colorClass: 'yellow',
    },
];
function init() {
    const view = new View();
    const model = new Model('t3-storage-key', players);
    model.addEventListener('statechange', (event) => {
        view.render(model.game, model.stats);
    });
    window.addEventListener('storage', () => view.render(model.game, model.stats));
    view.render(model.game, model.stats);
    view.bindGameResetEvent(() => {
        model.reset();
    });
    view.bindNewRoundEvent(() => {
        model.newRound();
    });
    view.bindPlayerMoveEvent((square) => {
        const existingMove = model.game.currentGameMoves.find((move) => move.squareId === +square.id);
        if (existingMove)
            return;
        model.playerMove(+square.id);
    });
}
window.addEventListener('load', init);
