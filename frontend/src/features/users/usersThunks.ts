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

export const registerThunk = createAsyncThunk<
    User,
    RegisterMutation,
    { rejectValue: IValidationError }
>("/users/registerThunk", async (registerForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.post<User>("/users/register", registerForm);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      const message = error.response.data.message;

      return rejectWithValue({
        errors: {
          name: message.includes("имя") ? { message } : undefined,
          phoneNumber: { message },
        },
      });
    }
    throw error;
  }
});



export const loginThunk = createAsyncThunk<
    User,
    LoginMutation,
    { rejectValue: IValidationError }
>("/users/loginThunk", async (loginForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.post<User>("/users/login", loginForm);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      const message = error.response.data.message;
      const lower = message.toLowerCase();

      let field: "name" | "phoneNumber" = "phoneNumber";

      if (lower.includes("имя") || lower.includes("пользователя")) {
        field = "name";
      } else if (lower.includes("номер") || lower.includes("тел")) {
        field = "phoneNumber";
      }

      return rejectWithValue({
        errors: {
          [field]: { message },
        },
      });
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

