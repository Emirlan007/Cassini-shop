import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  updateProduct,
  updateProductDiscount,
  updateProductNewStatus,
  updateProductPopular,
} from "./adminProductsThunks.ts";
import type { ProductInput } from "../../../types";

interface AdminProductsState {
  item: ProductInput | null;
  fetchItemLoading: boolean;
  fetchItemError: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean | string;
  updatePopularLoading: boolean;
  updatePopularError: string | null;
  updateIsNewLoading: boolean;
  updateIsNewError: string | null;
  updateDiscountLoading: boolean;
  updateDiscountError: string | null;
}

const initialState: AdminProductsState = {
  item: null,
  fetchItemLoading: false,
  fetchItemError: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  updatePopularLoading: false,
  updatePopularError: null,
  updateIsNewLoading: false,
  updateIsNewError: null,
  updateDiscountLoading: false,
  updateDiscountError: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.fetchItemLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, { payload: product }) => {
        state.fetchItemLoading = false;
        state.item = product;
      })
      .addCase(fetchProductById.rejected, (state, { payload: error }) => {
        state.fetchItemLoading = false;
        state.fetchItemError = error?.error ?? null;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createProduct.rejected, (state, { payload: error }) => {
        state.createLoading = false;
        state.createError = error?.error ?? null;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateProduct.rejected, (state, { payload: error }) => {
        state.updateLoading = false;
        state.updateError = error?.error ?? null;
      });

    builder
      .addCase(deleteProduct.pending, (state, { meta }) => {
        state.deleteLoading = meta.arg;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteLoading = false;
      });

    builder
      .addCase(updateProductPopular.pending, (state) => {
        state.updatePopularLoading = true;
        state.updatePopularError = null;
      })
      .addCase(updateProductPopular.fulfilled, (state) => {
        state.updatePopularLoading = false;
      })
      .addCase(updateProductPopular.rejected, (state) => {
        state.updatePopularLoading = false;
        state.updatePopularError = "Ошибка обновления статуса";
      });

    builder
      .addCase(updateProductNewStatus.pending, (state) => {
        state.updateIsNewLoading = true;
        state.updateIsNewError = null;
      })
      .addCase(updateProductNewStatus.fulfilled, (state) => {
        state.updateIsNewLoading = false;
      })
      .addCase(updateProductNewStatus.rejected, (state) => {
        state.updateIsNewLoading = false;
        state.updateIsNewError = "Ошибка обновления статуса";
      });

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
    selectUpdatingProduct: (state) => state.item,

    selectUpdatingProductFetchLoading: (state) => state.fetchItemLoading,
    selectUpdatingProductFetchError: (state) => state.fetchItemError,
    selectProductCreateLoading: (state) => state.createLoading,
    selectProductCreateError: (state) => state.createError,
    selectProductUpdateLoading: (state) => state.updateLoading,
    selectProductUpdateError: (state) => state.updateError,
    selectProductDeleteLoading: (state) => state.deleteLoading,
    selectUpdatePopularLoading: (state) => state.updatePopularLoading,
    selectUpdatePopularError: (state) => state.updatePopularError,
    selectUpdateIsNewLoading: (state) => state.updateIsNewLoading,
    selectUpdateIsNewError: (state) => state.updateIsNewError,
    selectUpdateDiscountLoading: (state) => state.updateDiscountLoading,
    selectUpdateDiscountError: (state) => state.updateDiscountError,
  },
});

export const adminProductsReducer = adminProductsSlice.reducer;

export const {
  selectUpdatingProduct,
  selectUpdatingProductFetchLoading,
  selectUpdatingProductFetchError,
  selectProductCreateLoading,
  selectProductCreateError,
  selectProductUpdateLoading,
  selectProductUpdateError,
  selectProductDeleteLoading,
  selectUpdatePopularLoading,
  selectUpdatePopularError,
  selectUpdateIsNewLoading,
  selectUpdateIsNewError,
  selectUpdateDiscountLoading,
  selectUpdateDiscountError,
} = adminProductsSlice.selectors;
