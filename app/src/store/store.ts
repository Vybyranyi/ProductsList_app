import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@store/ProductSlice';
import commentsReducer from '@store/CommentSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;