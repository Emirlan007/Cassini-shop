import { createSlice } from "@reduxjs/toolkit";
import type { OrderHistory, OrderHistoryStats } from "../../types";
import {
    fetchMyOrderHistory,
    fetchMyOrderHistoryStats,
    fetchOrderHistoryById,
} from "./orderHistoryThunks";

interface OrderHistoryState {
    history: OrderHistory[];
    historyLoading: boolean;
    historyError: string | null;
    stats: OrderHistoryStats | null;
    statsLoading: boolean;
    selectedHistory: OrderHistory | null;
    selectedHistoryLoading: boolean;
}

const initialState: OrderHistoryState = {
    history: [],
    historyLoading: false,
    historyError: null,
    stats: null,
    statsLoading: false,
    selectedHistory: null,
    selectedHistoryLoading: false,
};

const orderHistorySlice = createSlice({
    name: "orderHistory",
    initialState,
    reducers: {
        clearSelectedHistory: (state) => {
            state.selectedHistory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrderHistory.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(fetchMyOrderHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.history = action.payload;
            })
            .addCase(fetchMyOrderHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload as string;
            });

        builder
            .addCase(fetchMyOrderHistoryStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchMyOrderHistoryStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchMyOrderHistoryStats.rejected, (state) => {
                state.statsLoading = false;
            });

        builder
            .addCase(fetchOrderHistoryById.pending, (state) => {
                state.selectedHistoryLoading = true;
            })
            .addCase(fetchOrderHistoryById.fulfilled, (state, action) => {
                state.selectedHistoryLoading = false;
                state.selectedHistory = action.payload;
            })
            .addCase(fetchOrderHistoryById.rejected, (state) => {
                state.selectedHistoryLoading = false;
            });
    },
    selectors: {
        selectOrderHistory: (state) => state.history,
        selectOrderHistoryLoading: (state) => state.historyLoading,
        selectOrderHistoryError: (state) => state.historyError,
        selectOrderHistoryStats: (state) => state.stats,
        selectOrderHistoryStatsLoading: (state) => state.statsLoading,
        selectSelectedHistory: (state) => state.selectedHistory,
        selectSelectedHistoryLoading: (state) => state.selectedHistoryLoading,
    },
});

export const orderHistoryReducer = orderHistorySlice.reducer;
export const {
    selectOrderHistory,
    selectOrderHistoryLoading,
    selectOrderHistoryError,
    selectOrderHistoryStats,
    selectOrderHistoryStatsLoading,
    selectSelectedHistory,
    selectSelectedHistoryLoading,
} = orderHistorySlice.selectors;
export const { clearSelectedHistory } = orderHistorySlice.actions;