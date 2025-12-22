import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "../features/users/usersSlice";
import { productsReducer } from "../features/products/productsSlice";
import { bannersReducer } from "../features/banners/bannersSlice.ts";
import { categoriesReducer } from "../features/categories/categorySlice.ts";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist/es/constants";
import { persistReducer, persistStore } from "redux-persist";
import { cartReducer } from "../features/cart/cartSlice.ts";
import { ordersReducer } from "../features/orders/ordersSlice.ts";
import uiReducer from "../features/ui/uiSlice.ts";
import { adminUsersReducer } from "../features/users/admin/usersSlice.ts";
import { adminProductsReducer } from "../features/products/admin/adminProductsSlice.ts";
import { adminCategoriesReducer } from "../features/categories/admin/categorySlice.ts";
import { adminOrders } from "../features/orders/admin/ordersSlice.ts";
import { wishlistReducer } from "../features/wishlist/wishlistSlice.ts";
import { orderAnalyticsReducer } from "../features/analytics/orders/orderAnalyticsSlice.ts";
import { productAnalyticsReducer } from "../features/analytics/products/productAnalyticsSlice.ts";
import { searchKeywordsReducer } from "../features/analytics/search/searchKeywordsSlice.ts";

const userPersistConfig = {
  key: "shop:users",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  products: productsReducer,
  banners: bannersReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
  adminUsers: adminUsersReducer,
  adminProducts: adminProductsReducer,
  adminCategories: adminCategoriesReducer,
  users: persistReducer(userPersistConfig, usersReducer),
  cart: cartReducer,
  ui: uiReducer,
  adminOrders: adminOrders,
  wishlist: wishlistReducer,
  orderAnalytics: orderAnalyticsReducer,
  productAnalytics: productAnalyticsReducer,
  searchKeywords: searchKeywordsReducer,
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
