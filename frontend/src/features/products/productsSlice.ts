import {createSlice} from "@reduxjs/toolkit";
import type { Product } from "../../types";
import {
    createProduct,
    deleteProduct, fetchFilteredProducts, fetchPopularProducts,
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
    filteredItems: Product[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    filterLoading: boolean;
    filterError: string | null;
    popularProducts: Product[]
    popularProductsLoading: boolean
    popularProductsError: string | null
    popularProductsPage: number
    popularProductsHasMore: boolean
    popularProductsTotal: number
    popularProductTotalPages: number
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
    filteredItems: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    filterLoading: false,
    filterError: null,
    popularProducts: [],
    popularProductsLoading: false,
    popularProductsError: null,
    popularProductsPage: 0,
    popularProductsHasMore: false,
    popularProductsTotal: 0,
    popularProductTotalPages: 0,
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
            .addCase(fetchProducts.fulfilled, (state, {payload: products}) => {
                state.fetchItemsLoading = false;
                state.items = products;
            })
            .addCase(fetchProducts.rejected, (state, {payload: error}) => {
                state.fetchItemsLoading = false;
                state.fetchItemsError = error?.error ?? null;
            });

        builder
            .addCase(fetchProductById.pending, (state) => {
                state.fetchItemLoading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, {payload: product}) => {
                state.fetchItemLoading = false;
                state.item = product;
            })
            .addCase(fetchProductById.rejected, (state, {payload: error}) => {
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
            .addCase(createProduct.rejected, (state, {payload: error}) => {
                state.createLoading = false;
                state.createError = error?.error ?? null;
            });

        builder
            .addCase(deleteProduct.pending, (state, {meta}) => {
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
                (state, {payload: products}) => {
                    state.fetchItemsLoading = false;
                    state.items = products;
                }
            )
            .addCase(fetchSearchedProducts.rejected, (state, {payload: error}) => {
                state.fetchItemsLoading = false;
                state.fetchItemsError = error?.error ?? null;
            });

        builder
            .addCase(fetchFilteredProducts.pending, (state) => {
                state.filterLoading = true;
                state.filterError = null;
            })
            .addCase(fetchFilteredProducts.fulfilled, (state, {payload}) => {
                state.filterLoading = false;
                state.filteredItems = payload.products;
                state.totalCount = payload.totalCount;
                state.currentPage = payload.currentPage;
                state.totalPages = payload.totalPages;
                state.hasMore = payload.hasMore;
            })
            .addCase(fetchFilteredProducts.rejected, (state, {payload: error}) => {
                state.filterLoading = false;
                state.filterError = error?.error ?? null;
            });

        builder
            .addCase(fetchPopularProducts.pending, (state) => {
                state.popularProductsLoading = true;
                state.popularProductsError = null;
            })
            .addCase(fetchPopularProducts.fulfilled, (state, {payload: products}) => {
                state.popularProductsLoading = false;
                if (products.page === 1) {
                    state.popularProducts = products.items;
                } else {
                    state.popularProducts = [
                        ...state.popularProducts,
                        ...products.items
                    ];
                }

                state.popularProductsPage = products.page;
                state.popularProductsTotal = products.total;
                state.popularProductTotalPages = products.totalPages;
            })
            .addCase(fetchPopularProducts.rejected, (state, {payload: error}) => {
                state.popularProductsLoading = false;
                state.popularProductsError = error?.error ?? null;
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
        selectFilteredProducts: (state) => state.filteredItems,
        selectTotalCount: (state) => state.totalCount,
        selectCurrentPage: (state) => state.currentPage,
        selectTotalPages: (state) => state.totalPages,
        selectHasMore: (state) => state.hasMore,
        selectFilterLoading: (state) => state.filterLoading,
        selectFilterError: (state) => state.filterError,
        selectPopularProducts: (state) => state.popularProducts,
        selectPopularLoading: (state) => state.popularProductsLoading,
        selectPopularError: (state) => state.popularProductsError,
        selectPopularPage: (state) => state.popularProductsPage,
        selectPopularTotalPages: (state) => state.popularProductTotalPages,
        selectPopularTotal: (state) => state.popularProductsTotal,
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
    selectFilteredProducts,
    selectTotalCount,
    selectCurrentPage,
    selectTotalPages,
    selectHasMore,
    selectFilterLoading,
    selectFilterError,
    selectPopularProducts,
    selectPopularLoading,
    selectPopularError,
    selectPopularPage,
    selectPopularTotal,
    selectPopularTotalPages,
} = productsSlice.selectors;
