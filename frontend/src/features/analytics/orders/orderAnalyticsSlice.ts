import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderAnalytics } from "./orderAnalyticsThunks.ts";
import type { OrderAnalyticsResponse } from "../../../types";

interface OrderAnalyticsState {
  data: OrderAnalyticsResponse | null;
  loading: boolean;
}

const initialState: OrderAnalyticsState = {
  data: null,
  loading: false,
};

const orderAnalyticsSlice = createSlice({
  name: "orderAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderAnalytics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const orderAnalyticsReducer = orderAnalyticsSlice.reducer;