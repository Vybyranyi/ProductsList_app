import styles from './ConfirmationModal.module.scss';
import ActionButton from '@components/ActionButton/ActionButton';

export interface IConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal(props: IConfirmationModalProps) {
    if (!props.isOpen) {
        return null;
    }

    return (
        <div className={styles.modalOverlay} onClick={props.onCancel}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{props.title}</h2>
                    <button className={styles.closeBtn} onClick={props.onCancel}>X</button>
                </div>
                <div className={styles.modalBody}>
                    <h3>{props.message}</h3>
                </div>
                <div className={styles.modalFooter}>
                    <ActionButton
                        text="Confirm"
                        actionType="delete"
                        onClick={props.onConfirm}
                    />
                    <ActionButton
                        text="Cancel"
                        actionType="cancel"
                        onClick={props.onCancel}
                    />
                </div>
            </div>
        </div>
    );
}