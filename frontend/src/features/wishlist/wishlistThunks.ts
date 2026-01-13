import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../axiosApi.ts";
import type { Lang, Wishlist } from "../../types";

export const fetchWishlist = createAsyncThunk<Wishlist, { lang: Lang }>(
  "wishlist/fetch",
  async ({ lang }) => {
    const { data } = await axiosApi.get<Wishlist>("/wishlist", {
      params: { lang },
    });
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
    const { data } = await axiosApi.delete<Wishlist>(`/wishlist/${productId}`);
    return data;
  }
);
