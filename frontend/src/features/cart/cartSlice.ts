import type {CartItem} from "../../types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
}

const initialState: CartState = {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
}

const calculateTotals = (state: CartState) => {
    state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, { payload }: PayloadAction<CartItem>) => {
            const existingIndex = state.items.findIndex(
                (item) =>
                    item.productId === payload.productId &&
                    item.selectedColor === payload.selectedColor &&
                    item.selectedSize === payload.selectedSize
            );

            if (existingIndex !== -1) {
                state.items[existingIndex].quantity += payload.quantity;
            } else {
                state.items.push(payload);
            }

            calculateTotals(state);
        },

        updateQuantity: (
            state,
            { payload }: PayloadAction<{ productId: string; selectedColor: string; selectedSize: string; quantity: number }>
        ) => {
            const item = state.items.find(
                (i) =>
                    i.productId === payload.productId &&
                    i.selectedColor === payload.selectedColor &&
                    i.selectedSize === payload.selectedSize
            );

            if (!item) return;

            item.quantity = payload.quantity;

            if (item.quantity <= 0) {
                state.items = state.items.filter(
                    (i) =>
                        !(
                            i.productId === payload.productId &&
                            i.selectedColor === payload.selectedColor &&
                            i.selectedSize === payload.selectedSize
                        )
                );
            }

            calculateTotals(state);
        },

        removeFromCart: (
            state,
            { payload }: PayloadAction<{ productId: string; selectedColor: string; selectedSize: string }>
        ) => {
            state.items = state.items.filter(
                (item) =>
                    !(
                        item.productId === payload.productId &&
                        item.selectedColor === payload.selectedColor &&
                        item.selectedSize === payload.selectedSize
                    )
            );

            calculateTotals(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
        },
    },
    selectors: {
        selectItems: ( state ) => state.items,
        selectTotalPrice: (state) => state.totalPrice,
        selectTotalQuantity: (state) => state.totalQuantity,
    }
});

export const cartReducer = cartSlice.reducer;
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export const { selectItems, selectTotalQuantity, selectTotalPrice } = cartSlice.selectors;