import styles from '@components/ProductDetailsModal/ProductDetailsModal.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import editIcon from '@assets/images/edit.svg';
import trashIcon from '@assets/images/trash_can.svg';
import closeIcon from '@assets/images/remove_cross.svg';
import { deleteProduct } from '@store/ProductSlice';

export interface IProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
}

export default function ProductDetailsModal(props: IProductDetailsModalProps) {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector(state => state.products);
    const { comments } = useAppSelector(state => state.comments);

    const product = products.find(p => p.id === props.productId);
    const productComments = comments.filter(c => c.productId === props.productId);

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            props.onClose();
        }
    };

    const handleDelete = (id: number) => {
        dispatch(deleteProduct(id));
    };

    const handleEdit = (id: number) => {
        // dispatch(editProduct(id));
    };

    if (!props.isOpen || !product) {
        return null;
    }

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{product.name}</h2>
                    <div className={styles.headerButtons}>
                        <button onClick={() => handleEdit(props.productId)}>
                            <img src={editIcon} alt="Edit" />
                        </button>
                        <button onClick={() => handleDelete(props.productId)}>
                            <img src={trashIcon} alt="Delete" />
                        </button>
                        <button onClick={props.onClose}>
                            <img src={closeIcon} alt="Close" />
                        </button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.productDetails}>
                        <div className={styles.mainImageContainer}>
                            <img src={product.imageUrl} alt={product.name} className={styles.mainImage} />
                        </div>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <h4>Count</h4>
                                <h6>{product.count}</h6>
                            </div>
                            <div className={styles.detailItem}>
                                <h4>Weight</h4>
                                <h6>{product.weight}</h6>
                            </div>
                            <div className={styles.detailItem}>
                                <h4>Size</h4>
                                <h6>{product.size.width}x{product.size.height}</h6>
                            </div>
                        </div>
                    </div>

                    <div className={styles.commentsSection}>
                        <h3>Comments</h3>
                        {productComments.length > 0 ? (
                            <div className={styles.commentsList}>
                                {productComments.map(comment => (
                                    <div key={comment.id} className={styles.commentItem}>
                                        <h6 className={styles.commentDate}>{comment.date}</h6>
                                        <h6>{comment.description}</h6>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No comments for this product.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}