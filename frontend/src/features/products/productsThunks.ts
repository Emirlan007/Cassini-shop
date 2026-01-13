import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  FilteredProductsResponse,
  FilterParams,
  IGlobalError,
  Lang,
  PopularProducts,
  Product,
} from "../../types";
import { axiosApi } from "../../axiosApi";
import { isAxiosError } from "axios";

export const fetchProducts = createAsyncThunk<
  Product[],
  { categoryId?: string; lang?: Lang },
  { rejectValue: IGlobalError }
>("products/fetchAll", async ({ categoryId, lang }, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get<Product[]>("/products", {
      params: { categoryId, lang },
    });
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
  { limit?: number; lang?: Lang },
  { rejectValue: IGlobalError }
>("products/fetchPopular", async ({ limit = 8, lang }, { rejectWithValue }) => {
  try {
    const { data } = await axiosApi.get<PopularProducts>("/products/popular", {
      params: { limit, lang },
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

export const fetchProductBySlug = createAsyncThunk<
  Product,
  { slug?: string; lang?: Lang },
  { rejectValue: IGlobalError }
>("products/fetchBySlug", async ({ slug, lang }, { rejectWithValue }) => {
  try {
    const { data: product } = await axiosApi.get<Product>(
      "/products/slug/" + slug,
      {
        params: { lang },
      }
    );
    return product;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const fetchFilteredProducts = createAsyncThunk<
  FilteredProductsResponse,
  FilterParams & { categoryId: string } & { lang?: Lang },
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
      `/products/filter?${queryParams.toString()}`,
      { params: { lang: filterParams.lang } }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});
