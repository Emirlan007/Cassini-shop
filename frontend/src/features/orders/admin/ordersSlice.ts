import { createSlice } from "@reduxjs/toolkit";
import type { OrderItemAdmin } from "../../../types";
import { addAdminCommentToOrder, fetchAdminOrders } from "./ordersThunks";

interface IInitialState {
  orders: OrderItemAdmin[];
  isFetchingLoading: boolean;
  createCommentLoading: boolean;
}

const initialState: IInitialState = {
  orders: [],
  isFetchingLoading: false,
  createCommentLoading: false,
};

const ordersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
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
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFetchingOrders: (state) => state.isFetchingLoading,
    selectCreateAdminCommentLoading: (state) => state.createCommentLoading,
  },
});

export const adminOrders = ordersSlice.reducer;
export const {
  selectFetchingOrders,
  selectOrders,
  selectCreateAdminCommentLoading,
} = ordersSlice.selectors;
