import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../axiosApi";
import type { Banner, IGlobalError } from "../../types";
import { isAxiosError } from "axios";

export const fetchBanners = createAsyncThunk<
    Banner[],
    { lang?: "ru" | "en" | "kg" } | void,
    { rejectValue: IGlobalError }
>("banners/fetchBanners", async (params, { rejectWithValue }) => {
    try {
        const lang = params && "lang" in params ? params.lang : undefined;
        const response = await axiosApi.get<Banner[]>("/banners", {
            params: lang ? { lang } : {},
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        throw error;
    }
});

export const toggleBannerActive = createAsyncThunk<
    Banner,
    string,
    { rejectValue: IGlobalError }
>("banners/toggleBannerActive", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosApi.patch<Banner>(`/banners/${id}`);
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        throw error;
    }
});

export const deleteBanner = createAsyncThunk<
    string,
    string,
    { rejectValue: IGlobalError }
>("banners/deleteBanner", async (id, { dispatch, rejectWithValue }) => {
    try {
        await axiosApi.delete(`/banners/${id}`);
        await dispatch(fetchBanners());
        return id;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        throw error;
    }
});