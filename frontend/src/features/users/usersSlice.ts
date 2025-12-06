import {createSlice} from "@reduxjs/toolkit";
import type {IGlobalError, IValidationError, User} from "../../types";
import {
    loginThunk,
    logoutThunk,
    registerThunk, updateUserAddress,
} from "./usersThunks";

interface IUserReducerState {
    user: User | null;
    registerLoading: boolean;
    registerError: null | IValidationError;
    loginLoading: boolean;
    loginError: IGlobalError | null;
    logoutLoading: boolean;
    updateAddressLoading: boolean;
    updateAddressError: IGlobalError | null;
}

const initialState: IUserReducerState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
    logoutLoading: false,
    updateAddressLoading: false,
    updateAddressError: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        unSetUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerThunk.pending, (state) => {
                state.registerLoading = true;
            })
            .addCase(registerThunk.fulfilled, (state, {payload}) => {
                state.registerLoading = false;
                state.user = payload;
            })
            .addCase(registerThunk.rejected, (state, {payload}) => {
                state.registerLoading = false;
                state.registerError = payload || null;
            });

        builder
            .addCase(loginThunk.pending, (state) => {
                state.loginLoading = true;
            })
            .addCase(loginThunk.fulfilled, (state, {payload}) => {
                state.loginLoading = false;
                state.user = payload;
            })
            .addCase(loginThunk.rejected, (state, {payload}) => {
                state.loginLoading = false;
                state.loginError = payload || null;
            });

        builder
            .addCase(logoutThunk.pending, (state) => {
                state.logoutLoading = true;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.logoutLoading = false;
            })
            .addCase(logoutThunk.rejected, (state) => {
                state.logoutLoading = false;
            });
        builder
            .addCase(updateUserAddress.pending, (state) => {
                state.updateAddressLoading = true;
                state.updateAddressError = null;
            })
            .addCase(updateUserAddress.fulfilled, (state, { payload }) => {
                state.updateAddressLoading = false;
                state.user = payload;
            })
            .addCase(updateUserAddress.rejected, (state, { payload }) => {
                state.updateAddressLoading = false;
                state.updateAddressError = payload || null;
            });

    },
    selectors: {
        selectUser: (state) => state.user,
        selectRegisterLoading: (state) => state.registerLoading,
        selectRegisterError: (state) => state.registerError,
        selectLoginLoading: (state) => state.loginLoading,
        selectLoginError: (state) => state.loginError,
        selectLogoutLoading: (state) => state.logoutLoading,
        selectUpdateAddressLoading: (state) => state.updateAddressLoading,
        selectUpdateAddressError: (state) => state.updateAddressError,
    },
});

export const usersReducer = usersSlice.reducer;
export const {unSetUser} = usersSlice.actions;
export const {
    selectUser,
    selectRegisterLoading,
    selectRegisterError,
    selectLoginLoading,
    selectLoginError,
    selectLogoutLoading,
    selectUpdateAddressLoading,
    selectUpdateAddressError,
} = usersSlice.selectors;
