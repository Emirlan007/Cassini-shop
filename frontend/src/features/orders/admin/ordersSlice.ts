import { createSlice } from "@reduxjs/toolkit";
import type { OrderItemAdmin } from "../../../types";
import {addAdminCommentToOrder, fetchAdminOrders, updateOrderPaymentStatusThunk} from "./ordersThunks";

interface IInitialState {
  orders: OrderItemAdmin[];
  isFetchingLoading: boolean;
  createCommentLoading: boolean;
  updatePaymentStatusLoading: boolean;
  updatePaymentStatusError: string | null;
}

const initialState: IInitialState = {
  orders: [],
  isFetchingLoading: false,
  createCommentLoading: false,
    updatePaymentStatusLoading: false,
    updatePaymentStatusError: null,
};

const ordersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
      clearPaymentStatusError: (state) => {
          state.updatePaymentStatusError = null;
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
          .addCase(updateOrderPaymentStatusThunk.pending, (state) => {
              state.updatePaymentStatusLoading = true;
              state.updatePaymentStatusError = null;
          })
          .addCase(updateOrderPaymentStatusThunk.fulfilled, (state, action) => {
              state.updatePaymentStatusLoading = false;

              const updatedOrder = action.payload;
              const index = state.orders.findIndex(order => order._id === updatedOrder._id);
              if (index !== -1) {
                  state.orders[index] = updatedOrder;
              }
          })
          .addCase(updateOrderPaymentStatusThunk.rejected, (state, action) => {
              state.updatePaymentStatusLoading = false;
              state.updatePaymentStatusError = action.payload as string || "Ошибка при обновлении статуса оплаты";
          });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFetchingOrders: (state) => state.isFetchingLoading,
    selectCreateAdminCommentLoading: (state) => state.createCommentLoading,
    selectUpdatePaymentStatusLoading: (state) => state.updatePaymentStatusLoading,
    selectUpdatePaymentStatusError: (state) => state.updatePaymentStatusError,
  },
});

export const adminOrders = ordersSlice.reducer;
export const {
  selectFetchingOrders,
  selectOrders,
  selectCreateAdminCommentLoading,
  selectUpdatePaymentStatusLoading,
  selectUpdatePaymentStatusError,
} = ordersSlice.selectors;
export const { clearPaymentStatusError } = ordersSlice.actions;
