import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../axiosApi";
import type { OrderAnalyticsResponse } from "../../types";
import { isAxiosError } from "axios";

export const fetchOrderAnalytics = createAsyncThunk<
  OrderAnalyticsResponse,
  { period: "day" | "week" | "month" | "year" | "all" }
>(
  "analytics/fetchOrderAnalytics",
  async ({ period }, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get<OrderAnalyticsResponse>(
        `/analytics/orders?period=${period}`
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