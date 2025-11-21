import { createAsyncThunk } from "@reduxjs/toolkit";
import {isAxiosError} from "axios";
import type { CartItem } from "../../types";
import {axiosApi} from "../../axiosApi.ts";

export const createOrder = createAsyncThunk(
    "cart/createOrder",
    async (items: CartItem[], { rejectWithValue }) => {
        try {
            const response = await axiosApi.post("/orders", items);
            return response.data;
        }  catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
);

export const fetchOrders = createAsyncThunk(
    "cart/fetchOrders",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosApi.get('orders/my');
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
);