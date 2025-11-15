import {createAsyncThunk} from "@reduxjs/toolkit";
import type {IGlobalError, Product, ProductInput} from "../../types";
import {axiosApi} from "../../axiosApi";
import {isAxiosError} from "axios";

export const fetchProducts = createAsyncThunk<
    Product[],
    string | undefined,
    { rejectValue: IGlobalError }
>("products/fetchAll", async (categoryId, {rejectWithValue}) => {
    try {
        const url = categoryId 
            ? `/products?categoryId=${categoryId}`
            : "/products";
        const {data} = await axiosApi.get<Product[]>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }

        throw error;
    }
});

export const fetchProductById = createAsyncThunk<
    Product,
    string,
    { rejectValue: IGlobalError }
>("products/fetchOne", async (id, {rejectWithValue}) => {
    try {
        const {data: product} = await axiosApi.get<Product>("/products/" + id);
        return product;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }

        throw error;
    }
});

export const createProduct = createAsyncThunk<Product, ProductInput, { rejectValue: IGlobalError }>(
    "products/create",
    async (productData, {rejectWithValue}) => {
        try {
            const formData = new FormData();

            formData.append("name", productData.name);
            formData.append("price", String(productData.price));

            if (productData.size) {
                formData.append("size", JSON.stringify(productData.size));
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

            const {data: product} = await axiosApi.post<Product>(
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

export const deleteProduct = createAsyncThunk<void, string>(
    "products/delete",
    async (id) => {
        await axiosApi.delete("/products/" + id);
    }
);
