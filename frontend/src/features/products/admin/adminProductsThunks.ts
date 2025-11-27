import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  IGlobalError,
  Product,
  ProductDiscountInput,
} from "../../../types";
import { axiosApi } from "../../../axiosApi";
import type { RootState } from "../../../app/store";
import { isAxiosError } from "axios";

interface UpdateDiscountArgs {
  productId: string;
  discountData: ProductDiscountInput;
}

export const updateProductDiscount = createAsyncThunk<
  Product,
  UpdateDiscountArgs,
  { state: RootState; rejectValue: IGlobalError }
>(
  "adminProducts/updateDiscount",
  async ({ productId, discountData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.user?.token;
      const config = token ? { headers: { Authorization: token } } : undefined;

      const payload = {
        discount: discountData.discount,
        discountUntil: discountData.discountUntil || undefined,
      };

      const { data } = await axiosApi.patch<Product>(
        `/products/${productId}/discount`,
        payload,
        config
      );

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);


