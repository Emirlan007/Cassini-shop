import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../axiosApi";
import type {Banner, IGlobalError} from "../../types";
import { isAxiosError } from "axios";


export const fetchBanners = createAsyncThunk<
    Banner[],
    void,
    { rejectValue: IGlobalError }
>("banners/fetchBanners", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosApi.get<Banner[]>("/banners");
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
    { getState, rejectValue: IGlobalError }
>("banners/deleteBanner", async (id, {dispatch, rejectWithValue }) => {
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