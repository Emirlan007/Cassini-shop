import { createSlice } from "@reduxjs/toolkit";
import type { OrderItemAdmin } from "../../../types";
import {
  addAdminCommentToOrder,
  fetchAdminOrders,
 updateOrderStatusThunk,
} from "./ordersThunks";

interface IInitialState {
  orders: OrderItemAdmin[];
  isFetchingLoading: boolean;
  createCommentLoading: boolean;
  updateOrderStatusLoading: boolean;
  updateOrderStatusError: string | null;
}

const initialState: IInitialState = {
  orders: [],
  isFetchingLoading: false,
  createCommentLoading: false,
  updateOrderStatusLoading: false,
  updateOrderStatusError: null,
};

const ordersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearOrderStatusError: (state) => {
      state.updateOrderStatusError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isFetchingLoading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, { payload }) => {
        state.orders = payload;
        state.isFetchingLoading = false;
      })
      .addCase(fetchAdminOrders.rejected, (state) => {
        state.isFetchingLoading = false;
      });

    builder
      .addCase(addAdminCommentToOrder.pending, (state) => {
        state.createCommentLoading = true;
      })
      .addCase(addAdminCommentToOrder.fulfilled, (state) => {
        state.createCommentLoading = false;
      })
      .addCase(addAdminCommentToOrder.rejected, (state) => {
        state.createCommentLoading = false;
      });

    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.updateOrderStatusLoading = true;
        state.updateOrderStatusError = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.updateOrderStatusLoading = false;

        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.updateOrderStatusLoading = false;
        state.updateOrderStatusError =
          (action.payload as string) || "Ошибка при обновлении статуса оплаты";
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFetchingOrders: (state) => state.isFetchingLoading,
    selectCreateAdminCommentLoading: (state) => state.createCommentLoading,
    selectUpdateOrderStatusLoading: (state) =>
      state.updateOrderStatusLoading,
    selectUpdateOrderStatusError: (state) => state.updateOrderStatusError,
  },
});

export const adminOrders = ordersSlice.reducer;
export const {
  selectFetchingOrders,
  selectOrders,
  selectCreateAdminCommentLoading,
  selectUpdateOrderStatusLoading,
  selectUpdateOrderStatusError,
} = ordersSlice.selectors;
export const { clearOrderStatusError } = ordersSlice.actions;
