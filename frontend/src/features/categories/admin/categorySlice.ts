import {createSlice} from "@reduxjs/toolkit";
import {deleteCategory} from "./categoryThunk.ts";

interface CategoryState {
    deleteLoading: boolean | string;
}

const initialState: CategoryState = {
    deleteLoading: false,
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
            })
    },
    selectors: {
        selectCategoryDeleteLoading: (state) => state.deleteLoading,
    }
});

export const adminCategoriesReducer = adminCategoriesSlice.reducer;
export const { selectCategoryDeleteLoading } = adminCategoriesSlice.selectors;