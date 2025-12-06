import {createAsyncThunk} from "@reduxjs/toolkit";
import type {
    IGlobalError,
    IValidationError,
    LoginMutation,
    RegisterMutation,
    User,
} from "../../types";
import {axiosApi} from "../../axiosApi";
import {isAxiosError} from "axios";
import {unSetUser} from "./usersSlice";

export const registerThunk = createAsyncThunk<User, RegisterMutation, { rejectValue: IValidationError }>(
    "/users/registerThunk",
    async (registerForm, {rejectWithValue}) => {
        try {
            const {data} = await axiosApi.post<User>("/users/register", registerForm);
            return data;
        } catch (error) {
            if (
                isAxiosError(error) &&
                error.response &&
                error.response.status === 400
            ) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    });


export const loginThunk = createAsyncThunk<User, LoginMutation, { rejectValue: IGlobalError }>(
    "/users/loginThunk",
    async (loginForm, {rejectWithValue}) => {
        try {
            const {data} = await axiosApi.post<User>("/users/login", loginForm);
            return data;
        } catch (error) {
            if (
                isAxiosError(error) &&
                error.response &&
                error.response.status === 400
            ) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    });

export const logoutThunk = createAsyncThunk(
    "/users/logout",
    async (_, {dispatch}) => {
        try {
            await axiosApi.delete("/users/logout");
            dispatch(unSetUser());
        } catch (error) {
            console.log(error);
        }
    }
);

export const updateUserAddress = createAsyncThunk<
    User,
    { userId: string; city: string; address: string },
    { rejectValue: IGlobalError }
>(
    "/users/update-address",
    async ({ userId, city, address }, { rejectWithValue }) => {
        try {
            const { data } = await axiosApi.patch<User>(`/users/${userId}/address`, {
                city,
                address,
            });

            return data;
        } catch (error) {
            if (
                isAxiosError(error) &&
                error.response &&
                error.response.status === 400
            ) {
                return rejectWithValue(error.response.data);
            }
            throw error;
        }
    }
);

