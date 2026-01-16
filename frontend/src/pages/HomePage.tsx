import { useEffect, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPopularProducts,
  fetchProducts,
} from "../features/products/productsThunks";
import {
  selectPopularProducts,
  selectPopularProductsLoading,
  selectProducts,
  selectProductsFetchError,
  selectProductsFetchLoading,
} from "../features/products/productsSlice";
import BannersCarousel from "../features/banners/BannersCarousel.tsx";
import PopularProducts from "../features/products/PopularProducts.tsx";
import ProductList from "../features/products/ProductsList.tsx";
import { useTranslation } from "react-i18next";
import { generateProductListSchema } from "../utils/schemaGenerator";
import { validateProducts } from "../utils/schemaValidator";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productsLoading = useAppSelector(selectProductsFetchLoading);
  const productsError = useAppSelector(selectProductsFetchError);
  const popularProducts = useAppSelector(selectPopularProducts);
  const popularProductsLoading = useAppSelector(selectPopularProductsLoading);

  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";

  useEffect(() => {
    dispatch(fetchProducts({ lang: currentLang }));
    dispatch(fetchPopularProducts({ lang: currentLang }));
  }, [dispatch, currentLang]);

  const allProducts = useMemo(() => {
    return [...popularProducts, ...products];
  }, [popularProducts, products]);

  const productListSchema = useMemo(() => {
    if (allProducts.length === 0) return null;

    validateProducts(allProducts);

    return generateProductListSchema(allProducts);
  }, [allProducts]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        py: { xs: 3, sm: 4 },
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>
          {t("siteName", "Cassini Shop - Интернет-магазин модной одежды")}
        </title>
        <meta
          name="description"
          content={t(
            "siteDescription",
            "Широкий выбор качественной одежды. Популярные товары и новинки каждый день."
          )}
        />
        <link rel="canonical" href={window.location.origin} />

        <meta
          property="og:title"
          content={t(
            "siteName",
            "Cassini Shop - Интернет-магазин модной одежды"
          )}
        />
        <meta
          property="og:description"
          content={t(
            "siteDescription",
            "Широкий выбор качественной одежды. Популярные товары и новинки каждый день."
          )}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />

        <script type="application/ld+json">
          {JSON.stringify(productListSchema)}
        </script>
      </Helmet>

      <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
        <Box
          sx={{
            width: "100%",
            maxWidth: "1408px",
            mx: "auto",
            px: { xs: 2, sm: 3 },
          }}
        >
          <BannersCarousel />
        </Box>

        <Stack width="100%" spacing={8}>
          <PopularProducts
            products={popularProducts}
            loading={popularProductsLoading}
          />

          <ProductList
            products={products}
            loading={productsLoading}
            error={productsError}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePage;
