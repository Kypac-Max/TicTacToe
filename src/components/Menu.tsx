import { useState } from 'react';
import './Menu.css';

type Props = {
	onAction(action: 'reset' | 'new-round'): void;
};

function Menu({ onAction }: Props) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className='menu'>
			<button
				className='menu-btn'
				onClick={() => setMenuOpen((prev) => !prev)}>
				Actions
				<i
					className={`fa-solid fa-chevron-${
						menuOpen ? `up` : `down`
					}`}></i>
			</button>
			{menuOpen && (
				<div className='items border'>
					<button
						onClick={() => {
							onAction('reset');
							setMenuOpen((prev) => !prev);
						}}>
						Reset
					</button>
					<button
						onClick={() => {
							onAction('new-round');
							setMenuOpen((prev) => !prev);
						}}>
						New Round
					</button>
				</div>
			)}
		</div>
	);
}

export default Menu;
