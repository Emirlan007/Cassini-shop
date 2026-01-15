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
      const { data } = await axiosApi.get<PopularSearchKeywordsResponse>(
        `/search-queries/popular?page=${page}&limit=${limit}`
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
