import type {OrderItem} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {createOrder, fetchOrderById, fetchOrders} from "./ordersThunk.ts";

interface OrdersSlice {
    orders: OrderItem[];
    isCreating: boolean;
    isLoading: boolean;
    orderDetails: OrderItem | null;
    orderDetailsLoading: boolean;

}

const initialState: OrdersSlice = {
    orders: [],
    isCreating: false,
    isLoading: false,
    orderDetails: null,
    orderDetailsLoading: false,
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
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
        builder
            .addCase(fetchOrderById.pending, (state) => {
                state.orderDetailsLoading = true;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.orderDetailsLoading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state) => {
                state.orderDetailsLoading = false;
            });
    },
    selectors: {
        selectOrders: (state) => state.orders,
        selectIsCreating: (state) => state.isCreating,
        selectIsLoading: (state) => state.isLoading,
        selectOrderDetails: (state) => state.orderDetails,
        selectOrderDetailsLoading: (state) => state.orderDetailsLoading,
    }
});

export const ordersReducer = ordersSlice.reducer;
export const {
    selectOrders,
    selectIsCreating,
    selectIsLoading,
    selectOrderDetails,
    selectOrderDetailsLoading,
} = ordersSlice.selectors;
export const { clearOrderDetails } = ordersSlice.actions;