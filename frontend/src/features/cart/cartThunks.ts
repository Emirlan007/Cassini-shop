import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Cart, CartItem, IGlobalError } from "../../types";
import { axiosApi } from "../../axiosApi";
import { isAxiosError } from "axios";

export const fetchCart = createAsyncThunk<
  Cart,
  undefined,
  { rejectValue: IGlobalError }
>("cart/fetchOne", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get<Cart>("cart");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const addItemToCart = createAsyncThunk<
  Cart,
  CartItem,
  { rejectValue: IGlobalError }
>("cart/addItem", async (item, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.post<Cart>("cart/add", item);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const updateItemQuantity = createAsyncThunk<
  Cart,
  CartItem,
  { rejectValue: IGlobalError }
>("cart/updateQuantity", async (item, { rejectWithValue }) => {
  try {
    const { _id, ...rest } = item;
    const { data } = await axiosApi.patch<Cart>("cart/updateQuantity", rest);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const removeItem = createAsyncThunk<
  Cart,
  CartItem,
  { rejectValue: IGlobalError }
>("cart/removeItem", async (item, { rejectWithValue }) => {
  try {
    const { _id, ...rest } = item;
    const { data } = await axiosApi.patch<Cart>("cart/removeItem", rest);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const deleteCart = createAsyncThunk("cart/delete", async () => {
  await axiosApi.delete("cart");
});
