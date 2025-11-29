import type {Order} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {createOrder, fetchOrderById, fetchOrders, fetchOrdersByUserId} from "./ordersThunk.ts";

interface OrdersSlice {
    orders: Order[];
    isCreating: boolean;
    isLoading: boolean;
    orderDetails: Order | null;
    orderDetailsLoading: boolean;
    userOrders: Order[];
    userOrdersLoading: boolean;
    userOrdersError: string | null;
}

const initialState: OrdersSlice = {
    orders: [],
    isCreating: false,
    isLoading: false,
    orderDetails: null,
    orderDetailsLoading: false,
    userOrders: [],
    userOrdersLoading: false,
    userOrdersError: null,
}

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrderDetails: (state) => {
            state.orderDetails = null;
        },
        clearUserOrders: (state) => {
            state.userOrders = [];
            state.userOrdersError = null;
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
        builder
            .addCase(fetchOrdersByUserId.pending, (state) => {
                state.userOrdersLoading = true;
                state.userOrdersError = null;
            })
            .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
                state.userOrdersLoading = false;
                state.userOrders = action.payload;
            })
            .addCase(fetchOrdersByUserId.rejected, (state, action) => {
                state.userOrdersLoading = false;
                state.userOrdersError = action.payload as string || "Ошибка при загрузке заказов пользователя";
            });
    },
    selectors: {
        selectOrders: (state) => state.orders,
        selectIsCreating: (state) => state.isCreating,
        selectIsLoading: (state) => state.isLoading,
        selectOrderDetails: (state) => state.orderDetails,
        selectOrderDetailsLoading: (state) => state.orderDetailsLoading,
        selectUserOrders: (state) => state.userOrders,
        selectUserOrdersLoading: (state) => state.userOrdersLoading,
        selectUserOrdersError: (state) => state.userOrdersError,
    }
});

export const ordersReducer = ordersSlice.reducer;
export const {
    selectOrders,
    selectIsCreating,
    selectIsLoading,
    selectOrderDetails,
    selectOrderDetailsLoading,
    selectUserOrders,
    selectUserOrdersLoading,
    selectUserOrdersError,
} = ordersSlice.selectors;
export const { clearOrderDetails, clearUserOrders } = ordersSlice.actions;