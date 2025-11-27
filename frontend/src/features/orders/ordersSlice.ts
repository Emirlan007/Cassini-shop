import type {OrderItem} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {createOrder, fetchOrders} from "./ordersThunk.ts";

interface OrdersSlice {
    orders: OrderItem[];
    isCreating: boolean;
    isLoading: boolean;
}

const initialState: OrdersSlice = {
    orders: [],
    isCreating: false,
    isLoading: false,
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createOrder.fulfilled, (state) => {
                state.isCreating = false;
            })
            .addCase(createOrder.rejected, (state) => {
                state.isCreating =false;
            });
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.isLoading = false;
            });
    },
    selectors: {
        selectOrders: (state) => state.orders,
        selectIsCreating: (state) => state.isCreating,
        selectIsLoading: (state) => state.isLoading,
    }
});

export const ordersReducer = ordersSlice.reducer;
export const { selectOrders, selectIsCreating, selectIsLoading } = ordersSlice.selectors;
