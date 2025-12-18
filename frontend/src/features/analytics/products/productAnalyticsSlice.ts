import { createSlice } from "@reduxjs/toolkit";
import {fetchProductAnalytics, type ProductAnalyticsItem} from "./productAnalyticsThunks";

interface ProductAnalyticsState {
  data: ProductAnalyticsItem[];
  loading: boolean;
}

const initialState: ProductAnalyticsState = {
  data: [],
  loading: false,
};

const productAnalyticsSlice = createSlice({
  name: "productAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchProductAnalytics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const productAnalyticsReducer = productAnalyticsSlice.reducer;