import {createAsyncThunk} from "@reduxjs/toolkit";
import {isAxiosError} from "axios";
import {axiosApi} from "../../../axiosApi.ts";
import type {ICategory, UpdateCategoryPayload} from "../../../types";

export const deleteCategory = createAsyncThunk(
    "admin/categories/delete",
    async (id: string, {rejectWithValue}) => {
        try {
            await axiosApi.delete(`/categories/${id}`);
            return id;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }

    }
);

export const updateCategory = createAsyncThunk<ICategory,  UpdateCategoryPayload>(
    "admin/categories/update",
    async ({ _id, title }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.patch(`/categories/${_id}`, { title });
            return response.data;
        } catch {
            return rejectWithValue("Ошибка при обновлении категории");
        }
    }
);