import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosApi } from "../../../axiosApi.ts";

export type ProductAnalyticsPeriod = "day" | "week" | "month";

export interface ProductAnalyticsItem {
  productTitle: string;
  image?: string;
  addToCartQty: number;
  wishlistCount: number;
  views: number;
}

export const fetchProductAnalytics = createAsyncThunk<
  ProductAnalyticsItem[],
  { period: ProductAnalyticsPeriod }
>("productAnalytics/fetch", async ({ period }, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get<ProductAnalyticsItem[]>(
      `/analytics/products?period=${period}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
