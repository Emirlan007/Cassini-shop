import {createAsyncThunk} from "@reduxjs/toolkit";
import {isAxiosError} from "axios";
import {axiosApi} from "../../../axiosApi.ts";

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