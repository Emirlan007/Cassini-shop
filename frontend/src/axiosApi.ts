import axios from "axios";
import { API_URL } from "./constants";
import {type RootState, store} from "./app/store.ts";

export const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use((config) => {
    try {
        const state: RootState = store.getState();
        const token = state.users.user?.token;

        if (token && config.headers) {
            config.headers.Authorization = token;
        }
    } catch (e) {
        console.error(e);
    }

    return config;
});