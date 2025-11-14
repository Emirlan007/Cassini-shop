import { configureStore } from "@reduxjs/toolkit";
import {usersReducer} from "../features/users/usersSlice";
import { productsReducer } from "../features/products/productsSlice";
import {bannersReducer} from "../features/banners/bannersSlice";


export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    banners: bannersReducer,

  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
