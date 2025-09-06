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
    comments: IComment[];
};

export interface IComment {
    id: number;
    productId: number;
    description: string;
    date: string;
};

export interface IState {
    products: IProduct[];
    comments: IComment[];
    loading: boolean;
    error: string | null;
}

export const initialState: IState = {
    products: [],
    comments: [],
    loading: false,
    error: null,
};

export const getAllProducts = createAsyncThunk(
    'products/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || "failed to fetch products");
            }
            return data;
        } catch {
            return rejectWithValue("Network error during fetching products");
        }
    }
)

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
            });
    }
});

export default ProductSlice.reducer;
