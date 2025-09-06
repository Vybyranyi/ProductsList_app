import styles from './ActionButton.module.scss';

export interface IActionButton {
    text: string;
    actionType: 'confirm' | 'cancel' | 'delete';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export default function ActionButton(props: IActionButton) {
    const buttonClass = styles[props.actionType];

    return (
        <button
            className={buttonClass}
            onClick={props.onClick}
            type={props.type}
        >
            {props.text}
        </button>
    );
}