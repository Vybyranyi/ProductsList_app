import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { getAllProducts } from '@store/ProductSlice';
import Card from '@components/Card/Card';
import type { IProduct } from '@store/ProductSlice';

export default function ListPage() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAllProducts());
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
                            onClick={() => alert(prod.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noProductsFound}>No products found</p>
            )}
        </div>
    );
}