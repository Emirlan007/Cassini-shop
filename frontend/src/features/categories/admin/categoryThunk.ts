import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosApi } from "../../../axiosApi.ts";
import type {
  ICategory,
  UpdateCategoryPayload,
  TranslatedField,
} from "../../../types";

export interface CategoryMutation {
  title: TranslatedField;
  slug?: string;
}

export const createCategory = createAsyncThunk<
  ICategory,
  CategoryMutation,
  { rejectValue: string }
>("admin/categories/create", async ({ title }, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post("/categories", { title });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data?.error || "Ошибка при создании категории"
      );
    }
    throw error;
  }
});

export const deleteCategory = createAsyncThunk(
  "admin/categories/delete",
  async (id: string, { rejectWithValue }) => {
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

export const updateCategory = createAsyncThunk<
  ICategory,
  UpdateCategoryPayload
>(
  "admin/categories/update",
  async ({ _id, title, slug }, { rejectWithValue }) => {
    // Добавляем slug в параметры
    try {
      const response = await axiosApi.patch(`/categories/${_id}`, {
        title,
        slug,
      }); // Отправляем slug
      return response.data;
    } catch {
      return rejectWithValue("Ошибка при обновлении категории");
    }
  }
);
