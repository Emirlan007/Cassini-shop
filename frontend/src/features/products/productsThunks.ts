import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  FilteredProductsResponse,
  FilterParams,
  IGlobalError,
  PopularProducts,
  Product,
  ProductInput,
} from "../../types";
import { axiosApi } from "../../axiosApi";
import { isAxiosError } from "axios";
import type { RootState } from "../../app/store.ts";

export const fetchProducts = createAsyncThunk<
  Product[],
  string | undefined,
  { rejectValue: IGlobalError }
>("products/fetchAll", async (categoryId, { rejectWithValue }) => {
  try {
    const url = categoryId ? `/products?categoryId=${categoryId}` : "/products";
    const { data } = await axiosApi.get<Product[]>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const fetchPopularProducts = createAsyncThunk<
  PopularProducts,
  number | undefined,
  { rejectValue: IGlobalError }
>("products/fetchPopular", async (limit = 8, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get<PopularProducts>("/products/popular", {
      params: { limit },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const fetchSearchedProducts = createAsyncThunk<
  Product[],
  string | undefined,
  { rejectValue: IGlobalError }
>(
  "products/fetchSearchedProducts",
  async (searchValue, { rejectWithValue }) => {
    try {
      const url = searchValue
        ? `/products?searchValue=${searchValue}`
        : "/products";
      const { data } = await axiosApi.get<Product[]>(url);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: IGlobalError }
>("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data: product } = await axiosApi.get<Product>("/products/" + id);
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

    formData.append("name", productData.name);
    formData.append("price", String(productData.price));
    formData.append("category", productData.category);
    formData.append("inStock", String(productData.inStock ?? true));
    formData.append("isPopular", String(productData.isPopular ?? false));
    formData.append("material", productData.material || "");

    if (productData.size && productData.size.length > 0) {
      productData.size.forEach(s => {
        formData.append("size", s);
      });
    }

    if (productData.colors && productData.colors.length > 0) {
      productData.colors.forEach(c => {
        formData.append("colors", c);
      });
    }
    if (productData.description) {
      formData.append("description", productData.description);
    }

    if (productData.images) {
      for (const image of productData.images) {
        formData.append("images", image);
      }
    }

    if (productData.video) {
      formData.append("video", productData.video);
    }

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
  { product: ProductInput; _productId: string },
  { state: RootState }
>("products/update", async ({ product, _productId }, { getState }) => {
  const token = getState().users.user?.token;

  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("price", String(product.price));
  formData.append("category", product.category);
    formData.append("inStock", String(product.inStock ?? true));
    formData.append("isPopular", String(product.isPopular ?? false));

    if (product.material) {
        formData.append("material", product.material);
    }

  if (product.description) {
    formData.append("description", product.description);
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

  const { data } = await axiosApi.patch(`/products/${_productId}`, formData, {
    headers: { Authorization: token },
  });
  return data;
});

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
    await axiosApi.delete("/products/" + id);
    await dispatch(fetchProducts());
  }
);

export const fetchFilteredProducts = createAsyncThunk<
  FilteredProductsResponse,
  FilterParams & { categoryId: string },
  { rejectValue: IGlobalError }
>("products/fetchFiltered", async (filterParams, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();

    if (filterParams.categoryId) {
      queryParams.append("categoryId", filterParams.categoryId);
    }

    if (filterParams.colors?.length) {
      queryParams.append("colors", filterParams.colors.join(","));
    }

    if (filterParams.sizes?.length) {
      queryParams.append("sizes", filterParams.sizes.join(","));
    }

    if (filterParams.minPrice !== undefined) {
      queryParams.append("minPrice", filterParams.minPrice.toString());
    }

    if (filterParams.maxPrice !== undefined) {
      queryParams.append("maxPrice", filterParams.maxPrice.toString());
    }

    if (filterParams.material) {
      queryParams.append("material", filterParams.material);
    }

    if (filterParams.inStock !== undefined) {
      queryParams.append("inStock", filterParams.inStock.toString());
    }

    if (filterParams.isNew !== undefined) {
      queryParams.append("isNew", filterParams.isNew.toString());
    }

    if (filterParams.isPopular !== undefined) {
      queryParams.append("isPopular", filterParams.isPopular.toString());
    }

    if (filterParams.page) {
      queryParams.append("page", filterParams.page.toString());
    }

    if (filterParams.limit) {
      queryParams.append("limit", filterParams.limit.toString());
    }

    if (filterParams.sortBy) {
      queryParams.append("sortBy", filterParams.sortBy);
    }

    if (filterParams.sortOrder) {
      queryParams.append("sortOrder", filterParams.sortOrder);
    }

    const { data } = await axiosApi.get<FilteredProductsResponse>(
      `/products/filter?${queryParams.toString()}`
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
