import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ProductFormModal.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addProduct, editProduct, setProductToEdit } from '@store/ProductSlice';
import type { IProduct } from '@store/ProductSlice';
import closeIcon from '@assets/images/remove_cross.svg';

export interface IProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'add' | 'edit';
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Product name is required'),
    imageUrl: Yup.string()
        .url('Must be a valid URL')
        .required('Image URL is required'),
    count: Yup.number()
        .required('Count is required')
        .min(0, 'Count must be non-negative')
        .typeError('Count must be a number'),
    weight: Yup.string()
        .required('Weight is required'),
    size: Yup.object().shape({
        width: Yup.number()
            .required('Width is required')
            .min(1, 'Width must be greater than 0')
            .typeError('Width must be a number'),
        height: Yup.number()
            .required('Height is required')
            .min(1, 'Height must be greater than 0')
            .typeError('Height must be a number'),
    })
});

export default function ProductFormModal({ isOpen, onClose, type }: IProductFormModalProps) {
    const dispatch = useAppDispatch();
    const { productToEdit } = useAppSelector(state => state.products);

    const initialValues: Partial<IProduct> = {
        name: productToEdit?.name || '',
        imageUrl: productToEdit?.imageUrl || '',
        count: productToEdit?.count || 0,
        size: {
            width: productToEdit?.size?.width || 0,
            height: productToEdit?.size?.height || 0,
        },
        weight: productToEdit?.weight || '',
        comments: productToEdit?.comments || [],
    };

    const handleSubmit = (values: Partial<IProduct>) => {
        if (type === 'edit' && productToEdit) {
            console.log('Editing product:', { ...productToEdit, ...values });
            dispatch(editProduct({ ...productToEdit, ...values }));
        } else {
            console.log('Adding new product:', values);
            dispatch(addProduct(values));
        }
        dispatch(setProductToEdit(null));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{type === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className={styles.closeBtn} onClick={() => {
                        dispatch(setProductToEdit(null));
                        onClose();
                    }}>
                        <img src={closeIcon} alt="Close" />
                    </button>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Product Name</label>
                            <Field id="name" name="name" type="text" className={styles.input} />
                            <ErrorMessage name="name" component="h6" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="imageUrl">Image URL</label>
                            <Field id="imageUrl" name="imageUrl" type="text" className={styles.input} />
                            <ErrorMessage name="imageUrl" component="h6" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="count">Count</label>
                            <Field id="count" name="count" type="number" className={styles.input} />
                            <ErrorMessage name="count" component="h6" className={styles.error} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="weight">Weight</label>
                            <Field id="weight" name="weight" type="text" className={styles.input} />
                            <ErrorMessage name="weight" component="h6" className={styles.error} />
                        </div>

                        <div className={styles.sizeGroup}>
                            <div className={styles.formGroup}>
                                <label htmlFor="size.width">Width</label>
                                <Field id="size.width" name="size.width" type="number" className={styles.input} />
                                <ErrorMessage name="size.width" component="h6" className={styles.error} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="size.height">Height</label>
                                <Field id="size.height" name="size.height" type="number" className={styles.input} />
                                <ErrorMessage name="size.height" component="h6" className={styles.error} />
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button type="submit" className={styles.confirmButton}>Save</button>
                            <button type="button" onClick={() => {
                                dispatch(setProductToEdit(null));
                                onClose();
                            }} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}