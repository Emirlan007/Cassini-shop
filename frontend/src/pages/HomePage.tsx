import { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPopularProducts,
  fetchProducts,
} from "../features/products/productsThunks";
import {
  selectPopularProducts,
  selectPopularProductsLoading,
  selectProducts,
} from "../features/products/productsSlice";
import BannersCarousel from "../features/banners/BannersCarousel.tsx";
import PopularProducts from "../features/products/PopularProducts.tsx";
import ProductList from "../features/products/ProductsList.tsx";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const popularProducts = useAppSelector(selectPopularProducts);
  const popularProductsLoading = useAppSelector(selectPopularProductsLoading);

  const { i18n } = useTranslation();

  useEffect(() => {
    const handleChange = () => {
      const lang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";
      dispatch(fetchProducts({ lang }));
      dispatch(fetchPopularProducts({ lang }));
    };

    i18n.on("languageChanged", handleChange);

    handleChange();

    return () => {
      i18n.off("languageChanged", handleChange);
    };
  }, [dispatch, i18n]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        py: { xs: 3, sm: 4 },
        overflow: "hidden",
      }}
    >
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

          <ProductList products={products} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePage;
