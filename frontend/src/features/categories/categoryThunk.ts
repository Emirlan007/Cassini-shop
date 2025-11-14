import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ICategory } from "../../types";
import { axiosApi } from "../../axiosApi";
import { isAxiosError } from "axios";

export const fetchCategories = createAsyncThunk<
    ICategory[],
    void,
    { rejectValue: string }
>(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axiosApi.get("/categories");
        return data;
      } catch (err) {
        if (isAxiosError(err)) {
          const msg =
              (err.response?.data as { message?: string } | undefined)?.message ??
              err.message ??
              "Failed to load categories";
          return rejectWithValue(msg);
        }
        return rejectWithValue("Failed to load categories");
      }
    }
);

export const createCategory = createAsyncThunk<
    ICategory,
    { title: string; slug: string },
    { rejectValue: string }
>(
    "categories/createCategory",
    async (data, { rejectWithValue }) => {
      try {
        const { data: created } = await axiosApi.post("/categories", data);
        return created;
      } catch (err) {
        if (isAxiosError(err)) {
          const msg =
              (err.response?.data as { message?: string } | undefined)?.message ??
              err.message ??
              "Failed to create category";
          return rejectWithValue(msg);
        }
        return rejectWithValue("Failed to create category");
      }
    }
);