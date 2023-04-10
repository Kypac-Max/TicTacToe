import './Modal.css';

type Props = {
	message: string;
	onClick(): void;
};

function Modal({ message, onClick }: Props) {
	return (
		<div className='modal'>
			<div className='modal-contents'>
				<p>{message}</p>
				<button onClick={onClick}>Play Again</button>
			</div>
		</div>
	);
}

export default Modal;
