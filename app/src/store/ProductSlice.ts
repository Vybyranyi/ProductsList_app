import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export interface ISize {
    width: number;
    height: number;
};

export interface IProduct {
    id: number;
    imageUrl: string;
    name: string;
    count: number;
    size: ISize;
    weight: string;
    comments: number[];
};

export interface IState {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    productToEdit: IProduct | null;
}

export const initialState: IState = {
    products: [],
    loading: false,
    error: null,
    productToEdit: null,
};

export const getAllProducts = createAsyncThunk(
    'products/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/products`);
            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data.message || "Failed to fetch products");
            }
            return res.json();
        } catch {
            return rejectWithValue("Network error during fetching products");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data.message || "Failed to delete product");
            }
            return id;
        } catch {
            return rejectWithValue("Network error during product deletion");
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (newProduct: Partial<IProduct>, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });
            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data.message || "Failed to add product");
            }
            return res.json();
        } catch {
            return rejectWithValue("Network error during product creation");
        }
    }
);

export const editProduct = createAsyncThunk(
    'products/edit',
    async (editedProduct: IProduct, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/products/${editedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedProduct),
            });
            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data.message || "Failed to edit product");
            }
            return res.json();
        } catch {
            return rejectWithValue("Network error during product edit");
        }
    }
);

const ProductSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductToEdit: (state, action) => {
            state.productToEdit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.loading = false;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(editProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setProductToEdit } = ProductSlice.actions;
export default ProductSlice.reducer;