import { createSlice } from "@reduxjs/toolkit";
import type { OrderItem, OrderItemAdmin } from "../../../types";
import { fetchAdminOrders } from "./ordersThunks";

interface IInitialState {
  orders: OrderItemAdmin[];
  isFetchingLoading: boolean;
}

const initialState: IInitialState = {
  orders: [],
  isFetchingLoading: false,
};

const ordersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchAdminOrders.pending, (state)=>{
            state.isFetchingLoading = true
        })
        .addCase(fetchAdminOrders.fulfilled, (state, {payload})=>{
            state.orders = payload
             state.isFetchingLoading = false
        })
        .addCase(fetchAdminOrders.rejected, (state)=>{
             state.isFetchingLoading = false
        })
        
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFetchingOrders: (state) => state.isFetchingLoading,
  },
});

export const adminOrders = ordersSlice.reducer;
export const { selectFetchingOrders, selectOrders } = ordersSlice.selectors;
