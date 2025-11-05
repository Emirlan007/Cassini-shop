import axios from "axios";
import { API_URL } from "./constants";

export const axiosApi = axios.create({
  baseURL: API_URL,
});
