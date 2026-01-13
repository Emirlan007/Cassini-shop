import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosApi } from "../../axiosApi";
import type { OrderHistory, OrderHistoryStats } from "../../types";

export const fetchMyOrderHistory = createAsyncThunk<OrderHistory[]>(
    "orderHistory/fetchMyOrderHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get("/order-history/my");
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    }
);

export const fetchMyOrderHistoryStats = createAsyncThunk<OrderHistoryStats>(
    "orderHistory/fetchMyOrderHistoryStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get("/order-history/my/stats");
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    }
);

export const fetchOrderHistoryById = createAsyncThunk<OrderHistory, string>(
    "orderHistory/fetchOrderHistoryById",
    async (historyId: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get(`/order-history/${historyId}`);
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    }
);