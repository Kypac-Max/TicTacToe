import Menu from './components/Menu';
import Footer from './components/Footer';
import Modal from './components/Modal';
import type { GameState, Player } from './types';
import useLocalStorage from './useLocalStorage';
import { deriveGame, deriveStats } from './utils';
import { useState } from 'react';

// tsc convert all tsx to js files
// npm run build to convert all to js in the public folder

export default function App() {
	const [state, setState] = useLocalStorage<GameState>('t3-react-key', {
		currentGameMoves: [],
		history: {
			currentRoundGames: [],
			allGames: [],
		},
	});

	const [gameVsBot, setGameVsBot] = useState(false);

	const game = deriveGame(state);
	const stats = deriveStats(state);

	function handlePlayerMove(squareId: number, player: Player) {
		setState((prev) => {
			const stateClone = structuredClone(prev);

			stateClone.currentGameMoves.push({
				squareId,
				player,
			});

			if (gameVsBot && stateClone.currentGameMoves.length !== 9) {
				const moves = stateClone.currentGameMoves.map(
					(element) => element.squareId
				);
				const availableMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
					(el) => !moves.includes(el)
				);
				const randomMove = Math.floor(
					Math.random() * availableMoves.length
				);
				const bot = {
					id: 2,
					name: 'Player 2',
					iconClass: 'fa-o',
					colorClass: 'yellow',
				};
				stateClone.currentGameMoves.push({
					squareId: availableMoves[randomMove],
					player: bot,
				});
			}
			return stateClone;
		});
	}

	function resetGame(isNewRound: boolean) {
		setState((prev) => {
			const stateClone = structuredClone(prev);
			const { status, currentGameMoves } = game;

			if (status.isComplete) {
				stateClone.history.currentRoundGames.push({
					currentGameMoves,
					status,
				});
			}

			stateClone.currentGameMoves = [];

			if (isNewRound) {
				stateClone.history.allGames.push(
					...stateClone.history.currentRoundGames
				);
				stateClone.history.currentRoundGames = [];
			}

			return stateClone;
		});
	}

	return (
		<>
			<div className='grid'>
				<div className={`turn ${game.currentPlayer.colorClass}`}>
					<i
						className={`fa-solid ${game.currentPlayer.iconClass}`}></i>
					<p>{game.currentPlayer.name}, you're up!</p>
				</div>
				<Menu
					onAction={(action) => {
						if (action !== 'player-vs-bot') {
							setGameVsBot(false);
							resetGame(action === 'new-round');
						} else {
							resetGame(true);
							setGameVsBot(true);
						}
					}}
				/>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
					const existingMove = game.currentGameMoves.find(
						(move) => move.squareId === squareId
					);
					return (
						<div
							key={squareId}
							className='square shadow'
							onClick={() => {
								if (existingMove) return;
								handlePlayerMove(squareId, game.currentPlayer);
							}}>
							{existingMove && (
								<i
									className={`fa-solid ${existingMove.player.iconClass} ${existingMove.player.colorClass}`}></i>
							)}
						</div>
					);
				})}
				<div
					className='score shadow'
					style={{ backgroundColor: 'var(--turquoise)' }}>
					<p>Player 1</p>
					<span>{stats.playerWithStats[0].wins} Wins</span>
				</div>
				<div
					className='score shadow'
					style={{ backgroundColor: 'var(--light-gray)' }}>
					<p>Ties</p>
					<span>{stats.ties}</span>
				</div>
				<div
					className='score shadow'
					style={{ backgroundColor: 'var(--yellow)' }}>
					<p>Player 2</p>
					<span>{stats.playerWithStats[1].wins} Wins</span>
				</div>
			</div>

			<Footer />

			{game.status.isComplete && (
				<Modal
					message={
						game.status.winner
							? `${game.status.winner.name} you win!`
							: 'Tie'
					}
					onClick={() => resetGame(false)}
				/>
			)}
		</>
	);
}
