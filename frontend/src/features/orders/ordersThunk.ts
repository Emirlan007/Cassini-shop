import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import type { OrderMutation } from "../../types";
import { axiosApi } from "../../axiosApi.ts";

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (order: OrderMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/orders", order);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "cart/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get("orders/my");
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const fetchOrdersByUserId = createAsyncThunk(
  "orders/fetchOrdersByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/orders/admin/user/${userId}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return [];
        }
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const addUserCommentToOrder = createAsyncThunk(
  "cart/addUserCommentToOrder",
  async (
    commentData: { comment: string; orderId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosApi.post(
        `/orders/${commentData.orderId}/user-comment`,
        { comment: commentData.comment }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);
