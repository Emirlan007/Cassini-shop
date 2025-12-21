import {createSlice} from "@reduxjs/toolkit";
import {createCategory, deleteCategory, updateCategory} from "./categoryThunk.ts";

interface CategoryState {
  deleteLoading: string | null;
  updateLoading: string | null;
  createLoading: boolean;
}

const initialState: CategoryState = {
  deleteLoading: null,
  updateLoading: null,
  createLoading: false,
}

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(deleteCategory.pending, (state, {meta}) => {
          state.deleteLoading = meta.arg;
        })
        .addCase(deleteCategory.fulfilled, (state) => {
          state.deleteLoading = null;
        })
        .addCase(deleteCategory.rejected, (state) => {
          state.deleteLoading = null;
        });
    builder
        .addCase(updateCategory.pending, (state, {meta}) => {
          state.updateLoading = meta.arg._id
        })
        .addCase(updateCategory.fulfilled, (state) => {
          state.updateLoading = null
        })
        .addCase(updateCategory.rejected, (state) => {
          state.updateLoading = null
        })
    builder
        .addCase(createCategory.pending, (state) => {
          state.createLoading = true;
        })
        .addCase(createCategory.fulfilled, (state) => {
          state.createLoading = false;
        })
        .addCase(createCategory.rejected, (state) => {
          state.createLoading = false;
        });
  },
  selectors: {
    selectCategoryDeleteLoading: (state) => state.deleteLoading,
    selectCategoryUpdateLoading: (state) => state.updateLoading,
    selectCategoryCreateLoading: (state) => state.createLoading,
  }
});

export const adminCategoriesReducer = adminCategoriesSlice.reducer;
export const {
  selectCategoryDeleteLoading,
  selectCategoryUpdateLoading,
  selectCategoryCreateLoading
} = adminCategoriesSlice.selectors;