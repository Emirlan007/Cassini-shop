import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectProduct,
  selectProductFetchError,
  selectProductFetchLoading,
  selectProducts,
} from "../productsSlice";
import { fetchProductBySlug, fetchProducts } from "../productsThunks";
import { useTranslation } from "react-i18next";

export const useProductDetails = (productSlug: string) => {
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);
  const categoryProducts = useAppSelector(selectProducts);

  const { i18n } = useTranslation();

  const currentLang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";

  useEffect(() => {
    dispatch(fetchProductBySlug({ slug: productSlug, lang: currentLang }));
  }, [dispatch, productSlug, currentLang]);

  useEffect(() => {
    if (product?.category?._id) {
      dispatch(fetchProducts({ categoryId: product.category._id }));
    }
  }, [dispatch, product?.category?._id]);

  const recommended = categoryProducts
    .filter((p) => p.category?._id === product?.category?._id)
    .filter((p) => p._id !== product?._id)
    .slice(0, 4);

  return { product, loading, error, recommended };
};
