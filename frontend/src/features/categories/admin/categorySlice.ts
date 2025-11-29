import {createSlice} from "@reduxjs/toolkit";
import {createCategory, deleteCategory, updateCategory} from "./categoryThunk.ts";

interface CategoryState {
    deleteLoading: boolean | string;
    updateLoading: boolean | string;
    createLoading: boolean;
}

const initialState: CategoryState = {
    deleteLoading: false,
    updateLoading: false,
    createLoading: false,
}

const adminCategoriesSlice = createSlice({
    name: "adminCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteCategory.pending, (state, { meta }) => {
                state.deleteLoading = meta.arg;
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.deleteLoading = false;
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.deleteLoading = false;
            });
        builder
            .addCase(updateCategory.pending, (state, { meta }) => {
                state.updateLoading = meta.arg._id
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.updateLoading = false
            })
            .addCase(updateCategory.rejected, (state) => {
                state.updateLoading = false
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
export const { selectCategoryDeleteLoading, selectCategoryUpdateLoading, selectCategoryCreateLoading } = adminCategoriesSlice.selectors;