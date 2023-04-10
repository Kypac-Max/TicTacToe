import type { DerivedGame, DerivedStats } from './model';
import type { Move, Player } from './types';

/* type CustomTypeElement = {
	[key in string]: Element;
};

$: CustomTypeElement = {}; */

export default class View {
	$: Record<string, Element> = {};
	$$: Record<string, NodeListOf<Element>> = {};

	constructor() {
		this.$.grid = this.#qs('[data-id="grid"]');
		this.$.menu = this.#qs('[data-id="menu"]');
		this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
		this.$.menuItems = this.#qs('[data-id="menu-items"]');
		this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
		this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
		this.$.modal = this.#qs('[data-id="modal"]');
		this.$.modalText = this.#qs('[data-id="modal-text"]');
		this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
		this.$.turn = this.#qs('[data-id="turn"]');
		this.$.p1Stats = this.#qs('[data-id="p1-stats"]');
		this.$.p2Stats = this.#qs('[data-id="p2-stats"]');
		this.$.ties = this.#qs('[data-id="ties"]');

		this.$$.squares = this.#qsAll('[data-id="square"]');

		// UI-Only event listeners
		this.$.menuBtn.addEventListener('click', (e) => {
			this.#toggleMenu();
		});
	}

	render(game: DerivedGame, stats: DerivedStats) {
		const { playerWithStats, ties } = stats;
		const {
			currentGameMoves,
			currentPlayer,
			status: { isComplete, winner },
		} = game;

		this.#closeAll();
		this.#clearMoves();
		this.#updateScoreBoard(
			playerWithStats[0].wins,
			playerWithStats[1].wins,
			ties
		);
		this.#initializeMoves(currentGameMoves);

		if (isComplete) {
			this.#openModal(winner ? `${winner.name} wins!` : 'Tie!');
			return;
		}

		this.#setTurnIndicator(currentPlayer);
	}

	bindGameResetEvent(handler: EventListener) {
		this.$.resetBtn.addEventListener('click', handler);
		this.$.modalBtn.addEventListener('click', handler);
	}

	bindNewRoundEvent(handler: EventListener) {
		this.$.newRoundBtn.addEventListener('click', handler);
	}

	bindPlayerMoveEvent(handler: (el: Element) => void) {
		this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
	}

	/* Helper Methods */

	// # makes the method to hide from the controller

	#handlePlayerMove(squareEl: Element, player: Player) {
		const icon = document.createElement('i');
		icon.classList.add('fa-solid', player.iconClass, player.colorClass);
		squareEl.replaceChildren(icon);
	}

	#setTurnIndicator(player: Player) {
		const icon = document.createElement('i');
		const pLabel = document.createElement('p');

		icon.classList.add('fa-solid', player.colorClass, player.iconClass);
		pLabel.classList.add(player.colorClass);
		pLabel.textContent = `${player.name}, you're up!`;

		this.$.turn.replaceChildren(icon, pLabel);
	}

	#updateScoreBoard(p1Stats: number, p2Stats: number, ties: number) {
		this.$.p1Stats.textContent = `${p1Stats} wins`;
		this.$.p2Stats.textContent = `${p2Stats} wins`;
		this.$.ties.textContent = `${ties} ties`;
	}

	#openModal(message: string) {
		this.$.modal.classList.remove('hidden');
		this.$.modalText.textContent = message;
	}

	#closeAll() {
		this.#closeModal();
		this.#closeMenu();
	}

	#clearMoves() {
		this.$$.squares.forEach((square) => {
			square.replaceChildren();
		});
	}

	#initializeMoves(moves: Move[]) {
		this.$$.squares.forEach((square) => {
			const existingMove = moves.find(
				(move) => move.squareId === +square.id
			);
			if (existingMove)
				this.#handlePlayerMove(square, existingMove.player);
		});
	}

	#closeModal() {
		this.$.modal.classList.add('hidden');
	}

	#closeMenu() {
		this.$.menuItems.classList.add('hidden');
		this.$.menuBtn.classList.remove('border');

		const icon = this.#qs('i', this.$.menuBtn);

		icon.classList.add('fa-chevron-down');
		icon.classList.remove('fa-chevron-up');
	}

	#toggleMenu() {
		this.$.menuItems.classList.toggle('hidden');
		this.$.menuBtn.classList.toggle('border');

		const icon = this.#qs('i', this.$.menuBtn);

		icon.classList.toggle('fa-chevron-down');
		icon.classList.toggle('fa-chevron-up');
	}

	#qs(selector: string, parent?: Element) {
		const el = parent
			? parent.querySelector(selector)
			: document.querySelector(selector);

		if (!el) throw new Error('Could not find elements');

		return el;
	}

	#qsAll(selector: string) {
		const elList = document.querySelectorAll(selector);

		if (!elList) throw new Error('Could not find elements');

		return elList;
	}

	#delegate(
		el: Element,
		selector: string,
		eventKey: string,
		handler: (el: Element) => void
	) {
		el.addEventListener(eventKey, (event) => {
			if (!(event.target instanceof Element))
				throw new Error('Event target not found');

			if (event.target.matches(selector)) {
				handler(event.target);
			}
		});
	}
}
