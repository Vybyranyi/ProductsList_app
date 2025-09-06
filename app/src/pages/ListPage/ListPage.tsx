import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import { getAllComments, getAllProducts } from '@store/ProductSlice';
import Card from '@components/Card/Card';
import type { IProduct } from '@store/ProductSlice';
import ProductDetailsModal from '@components/ProductDetailsModal/ProductDetailsModal';

export default function ListPage() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const openModal = (id: number) => {
        setSelectedProductId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
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
                            onClick={() => openModal(prod.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noProductsFound}>No products found</p>
            )}
            {isModalOpen && selectedProductId !== null && (
                <ProductDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    productId={selectedProductId}
                />
            )}
        </div>
    );
}