import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ICategory,
  IGlobalError,
  Product,
  ProductDiscountInput,
  ProductInput,
} from "../../../types";
import { axiosApi } from "../../../axiosApi";
import type { RootState } from "../../../app/store";
import { isAxiosError } from "axios";
import { fetchProducts } from "../productsThunks";

interface UpdateDiscountArgs {
  productId: string;
  discountData: ProductDiscountInput;
}

export const fetchProductById = createAsyncThunk<
  ProductInput & { category: ICategory },
  string,
  { rejectValue: IGlobalError }
>("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data: product } = await axiosApi.get("/products/id/" + id);
    return product;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const createProduct = createAsyncThunk<
  Product,
  ProductInput,
  { rejectValue: IGlobalError }
>("products/create", async (productData, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("name", JSON.stringify(productData.name));
    formData.append("price", String(productData.price));
    formData.append("category", productData.category);
    formData.append("inStock", String(productData.inStock ?? true));
    formData.append("isPopular", String(productData.isPopular ?? false));

    if (productData.size && productData.size.length > 0) {
      productData.size.forEach((s) => {
        formData.append("size", s);
      });
    }

    if (productData.colors && productData.colors.length > 0) {
      productData.colors.forEach((c) => {
        formData.append("colors", c);
      });
    }

    if (productData.description.ru) {
      formData.append("description", JSON.stringify(productData.description));
    }

    if (productData.material.ru) {
      formData.append("material", JSON.stringify(productData.material));
    }

    if (productData.images) {
      for (const image of productData.images) {
        formData.append("images", image);
      }
    }

    if (productData.video) {
      formData.append("video", productData.video);
    }

    formData.append(
      "imagesByColor",
      JSON.stringify(productData.imagesByColor ?? {})
    );

    const { data: product } = await axiosApi.post<Product>(
      "/products",
      formData
    );

    return product;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { product: ProductInput; productId: string },
  { rejectValue: IGlobalError; state: RootState }
>(
  "products/update",
  async ({ product, productId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().users.user?.token;

      const formData = new FormData();

      formData.append("name", JSON.stringify(product.name));
      formData.append("price", String(product.price));
      formData.append("category", product.category);
      formData.append("inStock", String(product.inStock ?? true));
      formData.append("isPopular", String(product.isPopular ?? false));

      if (product.material) {
        formData.append("material", JSON.stringify(product.material));
      }

      if (product.description) {
        formData.append("description", JSON.stringify(product.description));
      }

      if (product.size) {
        for (const size of product.size) {
          formData.append("size", size);
        }
      }

      if (product.colors) {
        for (const color of product.colors) {
          formData.append("colors", color);
        }
      }

      if (product.images) {
        for (const image of product.images) {
          formData.append("images", image);
        }
      }

      if (product.video) {
        formData.append("video", product.video);
      }

      formData.append(
        "imagesByColor",
        JSON.stringify(product.imagesByColor ?? {})
      );

      const { data } = await axiosApi.patch(
        `/products/${productId}`,
        formData,
        {
          headers: { Authorization: token },
        }
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

export const updateProductPopular = createAsyncThunk<
  Product,
  { productId: string; isPopular: boolean },
  { state: RootState; rejectValue: IGlobalError }
>(
  "products/updateProductPopular",
  async ({ productId, isPopular }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.user?.token;

      const response = await axiosApi.patch(
        `/products/${productId}/popular`,
        { isPopular },
        {
          headers: token ? { Authorization: token } : {},
        }
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const updateProductNewStatus = createAsyncThunk<
  Product,
  { productId: string; isNew: boolean },
  { state: RootState; rejectValue: IGlobalError }
>(
  "products/updateProductNewStatus",
  async ({ productId, isNew }, { getState, rejectWithValue }) => {
    try {
      const token = getState().users.user?.token;

      const response = await axiosApi.patch(
        `/products/${productId}/new-status`,
        { isNew },
        {
          headers: token ? { Authorization: token } : {},
        }
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk<void, string>(
  "products/delete",
  async (id, { dispatch }) => {
    const currentLang = localStorage.getItem("i18nextLng")?.slice(0, 2) as
      | "ru"
      | "en"
      | "kg";

    await axiosApi.delete("/products/" + id);
    await dispatch(fetchProducts({ lang: currentLang }));
  }
);

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
