import type {AdminUser} from "../../../types";
import {createSlice} from "@reduxjs/toolkit";
import {fetchAllUsers} from "./usersThunks.ts";

interface UsersState{
    users: AdminUser[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    isLoading: false,
    error: null
}

const adminUsersSlice = createSlice({
    name: "adminUsers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, {payload: users}) => {
                state.isLoading = false;
                state.users = users;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? "Error";
            });
    },
    selectors: {
        selectUsers: state => state.users,
        selectIsLoading: state => state.isLoading,
    }
});

export const adminUsersReducer = adminUsersSlice.reducer;
export const { selectUsers, selectIsLoading } = adminUsersSlice.selectors;