import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../axiosApi.ts";
import type { Wishlist } from "../../types";

export const fetchWishlist = createAsyncThunk<Wishlist>(
    "wishlist/fetch",
    async () => {
        const { data } = await axiosApi.get<Wishlist>("/wishlist");
        return data;
    }
);

export const addToWishlist = createAsyncThunk<Wishlist, string>(
    "wishlist/add",
    async (productId) => {
        const { data } = await axiosApi.post<Wishlist>("/wishlist/add", {
            productId,
        });
        return data;
    }
);

export const removeFromWishlist = createAsyncThunk<Wishlist, string>(
    "wishlist/remove",
    async (productId) => {
        const { data } = await axiosApi.delete<Wishlist>(
            `/wishlist/${productId}`
        );
        return data;
    }
);