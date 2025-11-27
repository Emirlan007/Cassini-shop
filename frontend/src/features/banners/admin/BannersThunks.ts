import {createAsyncThunk} from "@reduxjs/toolkit";
import type {Banner, BannerFormData, IGlobalError} from "../../../types";
import {axiosApi} from "../../../axiosApi.ts";
import {isAxiosError} from "axios";

export const createBanner = createAsyncThunk<
    Banner,
    BannerFormData,
    { rejectValue: IGlobalError }
>("banners/createBanner", async (bannerData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("title", bannerData.title);

    if (bannerData.description) {
      formData.append("description", bannerData.description);
    }
    if (bannerData.link) {
      formData.append("link", bannerData.link);
    }
    if (bannerData.image) {
      formData.append("image", bannerData.image);
    }

    const response = await axiosApi.post<Banner>("/banners", formData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const fetchBannerById = createAsyncThunk<
    Banner,
    string,
    { rejectValue: IGlobalError }
>("banners/fetchBannerById", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosApi.get<Banner>(`/banners/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        throw error;
    }
});

export const updateBanner = createAsyncThunk<
    Banner,
    { id: string; data: BannerFormData },
    { rejectValue: IGlobalError }
>("banners/updateBanner", async ({ id, data }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("title", data.title);

        if (data.description) {
            formData.append("description", data.description);
        }
        if (data.link) {
            formData.append("link", data.link);
        }
        if (data.image) {
            formData.append("image", data.image);
        }

        const response = await axiosApi.put<Banner>(`/banners/${id}`, formData);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        throw error;
    }
});