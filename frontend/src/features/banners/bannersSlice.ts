import { createSlice } from "@reduxjs/toolkit";
import type {Banner, IGlobalError} from "../../types";
import {
    fetchBanners,
    toggleBannerActive,
    deleteBanner,
} from "./bannersThunks";
import {createBanner, fetchBannerById, updateBanner} from "./admin/BannersThunks.ts";


interface BannersState {
    banners: Banner[];
    fetchBannersLoading: boolean;
    fetchBannersError: string | null;
    createBannerLoading: boolean;
    updateBannerLoading: boolean;
    deleteBannerLoading: boolean;
    banner: Banner | null;
    fetchBannerLoading: boolean;
}

const initialState: BannersState = {
    banners: [],
    banner: null,
    fetchBannersLoading: false,
    fetchBannerLoading: false,
    fetchBannersError: null,
    createBannerLoading: false,
    updateBannerLoading: false,
    deleteBannerLoading: false,
};

const bannersSlice = createSlice({
    name: "banners",
    initialState,
    reducers: {
        clearBannersError: (state) => {
            state.fetchBannersError = null;
        },
        clearBanner: (state) => {
            state.banner = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.fetchBannersLoading = true;
                state.fetchBannersError = null;
            })
            .addCase(fetchBanners.fulfilled, (state, { payload }) => {
                state.fetchBannersLoading = false;
                state.banners = payload;
            })
            .addCase(fetchBanners.rejected, (state, { payload }) => {
                state.fetchBannersLoading = false;
                state.fetchBannersError = (payload as IGlobalError)?.error || "Failed to fetch banners";
            });

        builder
            .addCase(fetchBannerById.pending, (state) => {
                state.fetchBannerLoading = true;
            })
            .addCase(fetchBannerById.fulfilled, (state, { payload }) => {
                state.fetchBannerLoading = false;
                state.banner = payload;
            })
            .addCase(fetchBannerById.rejected, (state) => {
                state.fetchBannerLoading = false;
            });

        builder
            .addCase(createBanner.pending, (state) => {
                state.createBannerLoading = true;
            })
            .addCase(createBanner.fulfilled, (state, { payload }) => {
                state.createBannerLoading = false;
                state.banners.push(payload);
            })
            .addCase(createBanner.rejected, (state) => {
                state.createBannerLoading = false;
            });

        builder
            .addCase(updateBanner.pending, (state) => {
                state.updateBannerLoading = true;
            })
            .addCase(updateBanner.fulfilled, (state, { payload }) => {
                state.updateBannerLoading = false;
                const index = state.banners.findIndex(
                    (banner) => banner._id === payload._id
                );
                if (index !== -1) {
                    state.banners[index] = payload;
                }
                if (state.banner && state.banner._id === payload._id) {
                    state.banner = payload;
                }
            })
            .addCase(updateBanner.rejected, (state) => {
                state.updateBannerLoading = false;
            });

        builder.addCase(toggleBannerActive.fulfilled, (state, { payload }) => {
            const index = state.banners.findIndex(
                (banner) => banner._id === payload._id
            );
            if (index !== -1) {
                state.banners[index] = payload;
            }
        });

        builder
            .addCase(deleteBanner.pending, (state) => {
                state.deleteBannerLoading = true;
            })
            .addCase(deleteBanner.fulfilled, (state, { payload }) => {
                state.deleteBannerLoading = false;
                state.banners = state.banners.filter(
                    (banner) => banner._id !== payload
                );
            })
            .addCase(deleteBanner.rejected, (state) => {
                state.deleteBannerLoading = false;
            });
    },
    selectors: {
        selectBanners: (state) => state.banners,
        selectBanner: (state) => state.banner,
        selectFetchBannersLoading: (state) => state.fetchBannersLoading,
        selectFetchBannerLoading: (state) => state.fetchBannerLoading,
        selectCreateBannerLoading: (state) => state.createBannerLoading,
        selectUpdateBannerLoading: (state) => state.updateBannerLoading,
        selectDeleteBannerLoading: (state) => state.deleteBannerLoading,
        selectBannersError: (state) => state.fetchBannersError,
    },
});

export const bannersReducer = bannersSlice.reducer;
export const { clearBannersError, clearBanner } = bannersSlice.actions;
export const {
    selectBanners,
    selectBanner,
    selectFetchBannersLoading,
    selectFetchBannerLoading,
    selectCreateBannerLoading,
    selectUpdateBannerLoading,
    selectDeleteBannerLoading,
    selectBannersError,
} = bannersSlice.selectors;