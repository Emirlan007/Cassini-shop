import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../../axiosApi.ts";
import type { PopularSearchKeywordsResponse } from "../../../types";
import { isAxiosError } from "axios";

export const fetchPopularSearchKeywords = createAsyncThunk<
  PopularSearchKeywordsResponse,
  { page: number; limit: number }
>(
  "analytics/fetchPopularSearchKeywords",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get<
        Array<{ query: string; count: number }>
      >(`/search-queries/popular?limit=${limit}`);
      const items = data.map((item) => ({
        keyword: item.query,
        count: item.count,
      }));

      return {
        items,
        total: items.length,
        page,
        limit,
        totalPages: 1,
      };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);
