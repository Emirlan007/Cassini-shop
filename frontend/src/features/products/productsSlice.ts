import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  fetchSearchedProducts,
} from "./productsThunks";

interface ProductsState {
  items: Product[];
  item: Product | null;
  fetchItemsLoading: boolean;
  fetchItemsError: string | null;
  fetchItemLoading: boolean;
  fetchItemError: string | null;
  createLoading: boolean;
  createError: string | null;
  deleteLoading: boolean | string;
}

const initialState: ProductsState = {
  items: [],
  item: null,
  fetchItemsLoading: false,
  fetchItemsError: null,
  fetchItemLoading: false,
  fetchItemError: null,
  createLoading: false,
  createError: null,
  deleteLoading: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.fetchItemsLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload: products }) => {
        state.fetchItemsLoading = false;
        state.items = products;
      })
      .addCase(fetchProducts.rejected, (state, { payload: error }) => {
        state.fetchItemsLoading = false;
        state.fetchItemsError = error?.error ?? null;
      });

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
      .addCase(fetchSearchedProducts.pending, (state) => {
        state.fetchItemsLoading = true;
      })
      .addCase(
        fetchSearchedProducts.fulfilled,
        (state, { payload: products }) => {
          state.fetchItemsLoading = false;
          state.items = products;
        }
      )
      .addCase(fetchSearchedProducts.rejected, (state, { payload: error }) => {
        state.fetchItemsLoading = false;
        state.fetchItemsError = error?.error ?? null;
      });
  },
  selectors: {
    selectProducts: (state) => state.items,
    selectProduct: (state) => state.item,
    selectProductsFetchLoading: (state) => state.fetchItemsLoading,
    selectProductsFetchError: (state) => state.fetchItemsError,
    selectProductFetchLoading: (state) => state.fetchItemLoading,
    selectProductFetchError: (state) => state.fetchItemError,
    selectProductCreateLoading: (state) => state.createLoading,
    selectProductCreateError: (state) => state.createError,
    selectProductDeleteLoading: (state) => state.deleteLoading,
  },
});

export const productsReducer = productsSlice.reducer;
export const {
  selectProducts,
  selectProduct,
  selectProductsFetchLoading,
  selectProductsFetchError,
  selectProductFetchLoading,
  selectProductFetchError,
  selectProductCreateLoading,
  selectProductCreateError,
  selectProductDeleteLoading,
} = productsSlice.selectors;
