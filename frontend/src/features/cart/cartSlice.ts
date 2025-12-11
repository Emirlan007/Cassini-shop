import type { Cart } from "../../types";
import { createSlice } from "@reduxjs/toolkit";
import {
  addItemToCart,
  deleteCart,
  fetchCart,
  removeItem,
  updateItemQuantity,
} from "./cartThunks";

interface CartState {
  cart: Cart | null;
  fetchCartLoading: boolean;
  fetchCartError: string | null;
  addItemLoading: boolean;
  addItemError: string | null;
  updateQuantityLoading: boolean;
  updateQuantityError: string | null;
  removeItemLoading: boolean;
  removeItemError: string | null;
  deleteCartLoading: boolean;
}

const initialState: CartState = {
  cart: null,
  fetchCartLoading: false,
  fetchCartError: null,
  addItemLoading: false,
  addItemError: null,
  updateQuantityLoading: false,
  updateQuantityError: null,
  removeItemLoading: false,
  removeItemError: null,
  deleteCartLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.fetchCartLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, { payload: cart }) => {
        state.fetchCartLoading = false;
        state.cart = cart;
      })
      .addCase(fetchCart.rejected, (state, { payload: error }) => {
        state.fetchCartLoading = false;
        state.fetchCartError = error?.error ?? null;
      });

    builder
      .addCase(addItemToCart.pending, (state) => {
        state.addItemLoading = true;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.addItemLoading = false;
      })
      .addCase(addItemToCart.rejected, (state, { payload: error }) => {
        state.addItemLoading = false;
        state.addItemError = error?.error ?? null;
      });

    builder
      .addCase(updateItemQuantity.pending, (state) => {
        state.updateQuantityLoading = true;
      })
      .addCase(updateItemQuantity.fulfilled, (state) => {
        state.updateQuantityLoading = false;
      })
      .addCase(updateItemQuantity.rejected, (state, { payload: error }) => {
        state.updateQuantityLoading = false;
        state.updateQuantityError = error?.error ?? null;
      });

    builder
      .addCase(removeItem.pending, (state) => {
        state.removeItemLoading = true;
      })
      .addCase(removeItem.fulfilled, (state) => {
        state.removeItemLoading = false;
      })
      .addCase(removeItem.rejected, (state, { payload: error }) => {
        state.removeItemLoading = false;
        state.removeItemError = error?.error ?? null;
      });

    builder
      .addCase(deleteCart.pending, (state) => {
        state.deleteCartLoading = true;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.deleteCartLoading = false;
      })
      .addCase(deleteCart.rejected, (state) => {
        state.deleteCartLoading = false;
      });
  },
  selectors: {
    selectCart: (state) => state.cart,
    selectFetchCartLoading: (state) => state.fetchCartLoading,
    selectFetchCartError: (state) => state.fetchCartError,
    selectAddItemLoading: (state) => state.addItemLoading,
    selectAddItemError: (state) => state.addItemError,
    selectUpdateQuantityLoading: (state) => state.updateQuantityLoading,
    selectUpdateQuantityError: (state) => state.updateQuantityError,
    selectRemoveItemLoading: (state) => state.removeItemLoading,
    selectRemoveItemError: (state) => state.removeItemError,
    selectDeleteCartLoading: (state) => state.deleteCartLoading,
  },
});

export const cartReducer = cartSlice.reducer;

export const { clearCart } = cartSlice.actions;

export const {
  selectCart,
  selectFetchCartLoading,
  selectFetchCartError,
  selectAddItemLoading,
  selectAddItemError,
  selectUpdateQuantityLoading,
  selectUpdateQuantityError,
  selectRemoveItemLoading,
  selectRemoveItemError,
  selectDeleteCartLoading,
} = cartSlice.selectors;
