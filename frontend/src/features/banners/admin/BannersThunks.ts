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