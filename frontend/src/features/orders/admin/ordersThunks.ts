import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../../axiosApi";
import type { OrderItemAdmin } from "../../../types";
import { isAxiosError } from "axios";

export const fetchAdminOrders = createAsyncThunk<OrderItemAdmin[], void>(
  "admin/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get<OrderItemAdmin[]>(
        "orders/admin/orders"
      );
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const addAdminCommentToOrder = createAsyncThunk(
  "cart/addAdminCommentToOrder",
  async (
    commentData: { comment: string; orderId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosApi.post(
        `/orders/${commentData.orderId}/admin-comment`,
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

export const changeOrderDeliveryStatus = createAsyncThunk<
  OrderItemAdmin,
  { orderId: string; value: string }
>(
  "adminOrder/changeDeliveryStatus",
  async ({ orderId, value }, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.patch<OrderItemAdmin>(
        `orders/${orderId}/delivery-status`,
        { deliveryStatus: value }
      );
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async (
    { orderId, status }: { orderId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosApi.patch(`/orders/${orderId}/order-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);
