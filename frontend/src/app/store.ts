import {combineReducers, configureStore} from "@reduxjs/toolkit";
import { usersReducer } from "../features/users/usersSlice";
import { productsReducer } from "../features/products/productsSlice";
import {bannersReducer} from "../features/banners/bannersSlice.ts";
import {categoriesReducer} from "../features/categories/categorySlice.ts";
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import { persistReducer, persistStore } from 'redux-persist';
import {cartReducer} from "../features/cart/cartSlice.ts";
import {ordersReducer} from "../features/orders/ordersSlice.ts";

const userPersistConfig = {
  key: 'shop:users',
  storage,
  whitelist: ['user'],
};

const cartPersistConfig = {
  key: 'shop:cart',
  storage,
  whitelist: ['items', 'totalPrice', 'totalQuantity'],
}

const rootReducer = combineReducers({
  products: productsReducer,
  banners: bannersReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  users: persistReducer(userPersistConfig, usersReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
