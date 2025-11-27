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
