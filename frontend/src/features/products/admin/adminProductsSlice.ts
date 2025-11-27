import { createSlice } from "@reduxjs/toolkit";
import { updateProductDiscount } from "./adminProductsThunks.ts";

interface AdminProductsState {
  updateDiscountLoading: boolean;
  updateDiscountError: string | null;
}

const initialState: AdminProductsState = {
  updateDiscountLoading: false,
  updateDiscountError: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProductDiscount.pending, (state) => {
        state.updateDiscountLoading = true;
        state.updateDiscountError = null;
      })
      .addCase(updateProductDiscount.fulfilled, (state) => {
        state.updateDiscountLoading = false;
      })
      .addCase(updateProductDiscount.rejected, (state, { payload }) => {
        state.updateDiscountLoading = false;
        state.updateDiscountError =
          payload?.error ?? "Не удалось обновить скидку";
      });
  },
  selectors: {
    selectAdminUpdateDiscountLoading: (state) => state.updateDiscountLoading,
    selectAdminUpdateDiscountError: (state) => state.updateDiscountError,
  },
});

export const adminProductsReducer = adminProductsSlice.reducer;

export const {
  selectAdminUpdateDiscountError,
  selectAdminUpdateDiscountLoading,
} = adminProductsSlice.selectors;


