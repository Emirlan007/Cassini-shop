import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  IGlobalError,
  IValidationError,
  LoginMutation,
  RegisterMutation,
  User,
} from "../../types";
import { axiosApi } from "../../axiosApi";
import { isAxiosError } from "axios";
import type { RootState } from "../../app/store";
import { unSetUser } from "./usersSlice";

export const registerThunk = createAsyncThunk<
  User,
  RegisterMutation,
  { rejectValue: IValidationError }
>("/users/registerThunk", async (registerForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.post<User>("/users/register", { registerForm });
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

export const loginThunk = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: IGlobalError }
>("/users/loginThunk", async (registerForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.post<User>("/users/login", { registerForm });
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

export const logoutThunk = createAsyncThunk<void, void, { state: RootState }>(
  "/users/logout",
  async (_, { dispatch }) => {
    try {
      await axiosApi.delete("/users/logout");
      dispatch(unSetUser());
    } catch (error) {
      console.log(error);
    }
  }
);

export const googleLoginThunk = createAsyncThunk<
  User,
  string,
  { rejectValue: IGlobalError }
>("/users/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const { data: user } = await axiosApi.post<User>("/users/google", {
      credential,
    });
    return user;
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
