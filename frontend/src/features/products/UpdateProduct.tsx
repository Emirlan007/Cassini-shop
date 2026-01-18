import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import ProductForm from "./components/ProductForm.tsx";
import type { ProductInput } from "../../types";
import { fetchProducts } from "./productsThunks.ts";
import { useEffect } from "react";
import {
  selectProductUpdateLoading,
  selectUpdatingProduct,
} from "./admin/adminProductsSlice.ts";
import {
  fetchProductById,
  updateProduct,
} from "./admin/adminProductsThunks.ts";
import { useTranslation } from "react-i18next";

const UpdateProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectUpdatingProduct);
  const productUpdating = useAppSelector(selectProductUpdateLoading);
  const { productId } = useParams() as { productId: string };

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleSubmit = async (product: ProductInput) => {
    await dispatch(updateProduct({ product, productId })).unwrap();
    dispatch(fetchProducts({ lang: "ru" }));
    navigate("/");
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("products.editProduct")}
      </Typography>
      <ProductForm
        onSubmit={handleSubmit}
        loading={productUpdating}
        productData={product ?? undefined}
      />
    </>
  );
};

export default UpdateProduct;
