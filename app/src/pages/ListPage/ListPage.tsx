import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import { deleteProduct, getAllProducts, setProductToEdit } from '@store/ProductSlice';
import { getAllComments } from '@store/CommentSlice';
import Card from '@components/Card/Card';
import ProductDetailsModal from '@components/ProductDetailsModal/ProductDetailsModal';
import ProductFormModal from '@components/ProductFormModal/ProductFormModal';
import type { IProduct } from '@store/ProductSlice';

export default function ListPage() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const openDetailsModal = (id: number) => {
        setSelectedProductId(id);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedProductId(null);
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        dispatch(setProductToEdit(null));
        setSelectedProductId(null);
    };

    const handleEdit = (id: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            dispatch(setProductToEdit(product));
            openEditModal();
            closeDetailsModal();
        }
    };

    const handleDelete = (id: number) => {
        dispatch(deleteProduct(id));
    };

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getAllComments());
    }, [dispatch]);

    return (
        <div className={styles.listPage}>
            <h1 className={styles.title}>Product List</h1>
            {loading && <p>Loading products...</p>}
            {error && <p>Error: {error}</p>}
            {products.length > 0 ? (
                <div className={styles.productsGrid}>
                    {products.map((prod: IProduct) => (
                        <Card
                            key={prod.id}
                            id={prod.id}
                            name={prod.name}
                            imageUrl={prod.imageUrl}
                            onClick={() => openDetailsModal(prod.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noProductsFound}>No products found</p>
            )}

            {isDetailsModalOpen && selectedProductId !== null && (
                <ProductDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={closeDetailsModal}
                    productId={selectedProductId}
                    onEdit={handleEdit}
                    onDelete={handleDelete} 
                />
            )}
            
            {isEditModalOpen && (
                <ProductFormModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    type="edit"
                />
            )}
        </div>
    );
}