import './Footer.css';

function Footer() {
	return (
		<footer>
			<p>
				Original project by
				<a
					href='https://twitter.com/zg_dev'
					style={{ color: 'var(--yellow)' }}>
					@zg_dev
				</a>
			</p>

			<p>
				Refactored by
				<a
					href='https://github.com/Kypac-Max'
					style={{ color: 'var(--turquoise)' }}>
					Kypac-Max
				</a>
			</p>
		</footer>
	);
}

export default Footer;
