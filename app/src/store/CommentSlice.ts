import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export interface IComment {
    id: number;
    productId: number;
    description: string;
    date: string;
};

export interface ICommentState {
    comments: IComment[];
    loading: boolean;
    error: string | null;
}

export const initialCommentState: ICommentState = {
    comments: [],
    loading: false,
    error: null,
};

export const getAllComments = createAsyncThunk(
    'comments/getAllComments',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/comments`);
            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data.message || "Failed to fetch comments");
            }
            return res.json();
        } catch {
            return rejectWithValue("Network error during fetching comments");
        }
    }
);

const CommentSlice = createSlice({
    name: 'comments',
    initialState: initialCommentState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default CommentSlice.reducer;