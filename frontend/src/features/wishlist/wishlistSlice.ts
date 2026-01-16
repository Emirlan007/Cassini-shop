import {createSelector, createSlice} from "@reduxjs/toolkit";
import type { WishlistState } from "../../types";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "./wishlistThunks.ts";
import type { RootState } from "../../app/store";
import {logoutThunk} from "../users/usersThunks.ts";

const initialState: WishlistState = {
    wishlist: null,
    loading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch wishlist";
            })
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to add to wishlist";
            })
        builder
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to remove from wishlist";
            });
        builder
            .addCase(logoutThunk.fulfilled, () => initialState);
    },
});

export const wishlistReducer = wishlistSlice.reducer;

export const selectWishlist = (state: RootState) => state.wishlist.wishlist;
export const selectWishlistLoading = (state: RootState) => state.wishlist.loading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectWishlistProductIds = createSelector(
    [selectWishlist],
    (wishlist) => {
        if (!wishlist?.products) return [];
        return wishlist.products.map((p) => p._id);
    }
);
export const selectWishlistCount = createSelector(
  [selectWishlist],
  (wishlist) => {
    if (!wishlist?.products) return 0;
    return wishlist.products.length;
  }
);