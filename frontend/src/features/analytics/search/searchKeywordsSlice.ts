import { createSlice } from "@reduxjs/toolkit";
import { fetchPopularSearchKeywords } from "./searchKeywordsThunks.ts";
import type { SearchKeywordStat } from "../../../types";

interface SearchKeywordsState {
  items: SearchKeywordStat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: SearchKeywordsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

const searchKeywordsSlice = createSlice({
  name: "searchKeywords",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularSearchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularSearchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPopularSearchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch search keywords";
      });
  },
});

export const searchKeywordsReducer = searchKeywordsSlice.reducer;
