import type { ICategory } from "../../types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, createCategory } from "./categoryThunk";

interface CategoryState {
  categoriesAll: ICategory[];
  fetchingCategories: boolean;
  fetchError: string | null;
  creating: boolean;
  createError: string | null;
}

const initialState: CategoryState = {
  categoriesAll: [],
  fetchingCategories: false,
  fetchError: null,
  creating: false,
  createError: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchCategories.pending, (state) => {
          state.fetchingCategories = true;
          state.fetchError = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.fetchingCategories = false;
          state.categoriesAll = action.payload;
          state.fetchError = null;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.fetchingCategories = false;
          state.fetchError = action.payload ?? "Unknown error";
        });

    builder
        .addCase(createCategory.pending, (state) => {
          state.creating = true;
          state.createError = null;
        })
        .addCase(createCategory.fulfilled, (state, action) => { // ✅ ADDED
          state.creating = false;
          state.categoriesAll.push(action.payload);
        })
        .addCase(createCategory.rejected, (state, action) => {  // ✅ ADDED
          state.creating = false;
          state.createError = action.payload ?? "Unknown error";
        });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
