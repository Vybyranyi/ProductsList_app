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
}

export const initialState: IState = {
    products: [],
    loading: false,
    error: null,
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

const ProductSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
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
            });
    }
});

export default ProductSlice.reducer;