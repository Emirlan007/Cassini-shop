import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectProduct,
  selectProductFetchError,
  selectProductFetchLoading,
  selectProducts,
} from "../productsSlice";
import { fetchProductById, fetchProducts } from "../productsThunks";

export const useProductDetails = (productId: string) => {
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);
  const categoryProducts = useAppSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.category?._id) {
      dispatch(fetchProducts(product.category._id));
    }
  }, [dispatch, product?.category?._id]);

  const recommended = useMemo(
    () =>
      categoryProducts
        .filter((p) => p.category?._id === product?.category?._id)
        .filter((p) => p._id !== product?._id)
        .slice(0, 4),
    [categoryProducts, product]
  );

  return { product, loading, error, recommended };
};
