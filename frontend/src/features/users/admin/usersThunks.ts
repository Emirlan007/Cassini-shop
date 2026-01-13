import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosApi} from "../../../axiosApi.ts";
import {isAxiosError} from "axios";
import type {AdminUser} from "../../../types";

export const fetchAllUsers = createAsyncThunk<AdminUser[], void, { rejectValue: string }>(
    "adminUsers/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosApi.get<AdminUser[]>("/users/getAllUsers");
            return data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }

            throw error;
        }
    }
)