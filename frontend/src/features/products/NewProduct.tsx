import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { Typography } from "@mui/material";
import ProductForm from "./components/ProductForm.tsx";
import type { ProductInput } from "../../types";
import { fetchProducts } from "./productsThunks.ts";
import { selectProductCreateLoading } from "./admin/adminProductsSlice.ts";
import { createProduct } from "./admin/adminProductsThunks.ts";

const NewProduct = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productCreating = useAppSelector(selectProductCreateLoading);

  const handleSubmit = async (product: ProductInput) => {
    await dispatch(createProduct(product)).unwrap();
    dispatch(fetchProducts({ lang: "ru" }));
    navigate("/");
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Новый товар
      </Typography>
      <ProductForm onSubmit={handleSubmit} loading={productCreating} />
    </>
  );
};

export default NewProduct;
