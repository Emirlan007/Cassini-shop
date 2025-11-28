import {createSlice} from "@reduxjs/toolkit";
import {deleteCategory, updateCategory} from "./categoryThunk.ts";

interface CategoryState {
    deleteLoading: boolean | string;
    updateLoading: boolean | string;
}

const initialState: CategoryState = {
    deleteLoading: false,
    updateLoading: false,
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
    },
    selectors: {
        selectCategoryDeleteLoading: (state) => state.deleteLoading,
        selectCategoryUpdateLoading: (state) => state.updateLoading,
    }
});

export const adminCategoriesReducer = adminCategoriesSlice.reducer;
export const { selectCategoryDeleteLoading, selectCategoryUpdateLoading } = adminCategoriesSlice.selectors;