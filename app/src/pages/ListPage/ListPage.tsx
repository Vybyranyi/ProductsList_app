import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import { deleteProduct, getAllProducts, setProductToEdit } from '@store/ProductSlice';
import { getAllComments } from '@store/CommentSlice';
import Card from '@components/Card/Card';
import ProductDetailsModal from '@components/ProductDetailsModal/ProductDetailsModal';
import ProductFormModal from '@components/ProductFormModal/ProductFormModal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import SortControl from '@components/SortControl/SortControl';
import ActionButton from '@components/ActionButton/ActionButton';
import type { IProduct } from '@store/ProductSlice';

export default function ListPage() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'name' | 'count' | 'weight'>('name');

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
        // Після закриття модалки редагування, ми повертаємось до списку
        setSelectedProductId(null);
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductIdToDelete(null);
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
        setProductIdToDelete(id);
        openDeleteModal();
    };

    const handleConfirmDelete = () => {
        if (productIdToDelete !== null) {
            dispatch(deleteProduct(productIdToDelete));
            closeDeleteModal();
            closeDetailsModal();
        }
    };

    const handleCancelDelete = () => {
        closeDeleteModal();
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as 'name' | 'count' | 'weight');
    };

    const sortedProducts = [...products].sort((a, b) => {
        let compareResult = 0;

        if (sortOrder === 'name') {
            compareResult = a.name.localeCompare(b.name);
        } else if (sortOrder === 'count') {
            compareResult = a.count - b.count;
        } else if (sortOrder === 'weight') {
            const weightA = parseInt(a.weight);
            const weightB = parseInt(b.weight);
            compareResult = weightA - weightB;
        }

        if (compareResult === 0 && sortOrder !== 'count') {
            return a.count - b.count;
        }

        return compareResult;
    });

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getAllComments());
    }, [dispatch]);

    return (
        <div className={styles.listPage}>
            <div className={styles.titleContainer}>
                <h1>Product List</h1>
                <div className={styles.controls}>
                    <SortControl sortOrder={sortOrder} onSortChange={handleSortChange} />
                    <ActionButton text='Add product' actionType='confirm' onClick={openEditModal} />
                </div>
            </div>

            {loading && <p>Loading products...</p>}
            {error && <p>Error: {error}</p>}
            {sortedProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                    {sortedProducts.map((prod: IProduct) => (
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

            {isDeleteModalOpen && productIdToDelete !== null && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}