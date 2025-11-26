import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "../../../axiosApi";

export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchAdminOrders",
  async () => {
    try {
      const { data } = await axiosApi.get("orders/admin/orders");
      return data;
    } catch (e) {
      console.log(e);
    }
  }
);
