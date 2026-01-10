import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types";
import {
  fetchFilteredProducts,
  fetchPopularProducts,
  fetchProductBySlug,
  fetchProducts,
  fetchSearchedProducts,
} from "./productsThunks";

interface ProductsState {
  items: Product[];
  popularItems: Product[];
  item: Product | null;
  fetchItemsLoading: boolean;
  fetchItemsError: string | null;
  fetchItemLoading: boolean;
  fetchItemError: string | null;
  filteredItems: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  filterLoading: boolean;
  filterError: string | null;
  fetchPopularLoading: boolean;
  fetchPopularError: string | null;
}

const initialState: ProductsState = {
  items: [],
  popularItems: [],
  item: null,
  fetchItemsLoading: false,
  fetchItemsError: null,
  fetchItemLoading: false,
  fetchItemError: null,
  filteredItems: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  filterLoading: false,
  filterError: null,
  fetchPopularLoading: false,
  fetchPopularError: null,
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
      .addCase(fetchPopularProducts.pending, (state) => {
        state.fetchPopularLoading = true;
      })
      .addCase(
        fetchPopularProducts.fulfilled,
        (state, { payload: { items: products } }) => {
          state.fetchPopularLoading = false;
          state.popularItems = products;
        }
      )
      .addCase(fetchPopularProducts.rejected, (state, { payload: error }) => {
        state.fetchPopularLoading = false;
        state.fetchPopularError = error?.error ?? null;
      });

    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.fetchItemLoading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, { payload: product }) => {
        state.fetchItemLoading = false;
        state.item = product;
      })
      .addCase(fetchProductBySlug.rejected, (state, { payload: error }) => {
        state.fetchItemLoading = false;
        state.fetchItemError = error?.error ?? null;
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

    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.filterLoading = true;
        state.filterError = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, { payload }) => {
        state.filterLoading = false;
        state.filteredItems = payload.products;
        state.totalCount = payload.totalCount;
        state.currentPage = payload.currentPage;
        state.totalPages = payload.totalPages;
        state.hasMore = payload.hasMore;
      })
      .addCase(fetchFilteredProducts.rejected, (state, { payload: error }) => {
        state.filterLoading = false;
        state.filterError = error?.error ?? null;
      });
  },
  selectors: {
    selectProducts: (state) => state.items,
    selectProduct: (state) => state.item,
    selectProductsFetchLoading: (state) => state.fetchItemsLoading,
    selectProductsFetchError: (state) => state.fetchItemsError,
    selectProductFetchLoading: (state) => state.fetchItemLoading,
    selectProductFetchError: (state) => state.fetchItemError,
    selectFilteredProducts: (state) => state.filteredItems,
    selectTotalCount: (state) => state.totalCount,
    selectCurrentPage: (state) => state.currentPage,
    selectTotalPages: (state) => state.totalPages,
    selectHasMore: (state) => state.hasMore,
    selectFilterLoading: (state) => state.filterLoading,
    selectFilterError: (state) => state.filterError,
    selectPopularProducts: (state) => state.popularItems,
    selectPopularProductsLoading: (state) => state.fetchPopularLoading,
    selectPopularProductsError: (state) => state.fetchPopularError,
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
  selectFilteredProducts,
  selectTotalCount,
  selectCurrentPage,
  selectTotalPages,
  selectHasMore,
  selectFilterLoading,
  selectFilterError,
  selectPopularProducts,
  selectPopularProductsLoading,
  selectPopularProductsError,
} = productsSlice.selectors;
