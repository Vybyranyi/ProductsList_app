import styles from '@components/Card/Card.module.scss';

export interface ICardProps {
    id: number;
    name: string;
    imageUrl: string;
    onClick?: () => void;
}

export default function Card(props: ICardProps) {
    return (
        <div className={styles.card} key={props.id} onClick={props.onClick}>
            <img src={props.imageUrl} alt={props.name} />
            <h2>{props.name}</h2>
        </div>
    )
}
