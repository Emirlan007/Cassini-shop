import type React from "react";
import type { Product } from "../../types";
import {
  Box,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import ProductList from "./ProductsList";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./components/ProductCard";
import { Navigation } from "swiper/modules";
import "swiper/swiper.css";
import "swiper/swiper-bundle.css";
import { useTranslation } from "react-i18next";

interface Props {
  products: Product[];
  loading: boolean;
}

const StyledSwiper = styled(Swiper)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    height: "400px",
  },

  [theme.breakpoints.up("md")]: {
    height: "460px",
  },

  [theme.breakpoints.up("lg")]: {
    height: "520px",
  },
}));

const PopularProducts: React.FC<Props> = ({ products, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) return;

  if (products.length <= 8) {
    return (
      <Stack
        sx={{
          background: "#6600330d",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            pl: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            mb: 2,
            alignSelf: {
              sm: "flex-start",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: "17.6px",
              lineHeight: "125%",
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            {t("popularProducts")}
          </Typography>
        </Box>
        <ProductList products={products} />
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      sx={{
        background: "#6600330d",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          pl: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          mb: 2,
          alignSelf: {
            sm: "flex-start",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: "17.6px",
            lineHeight: "125%",
            letterSpacing: "-0.02em",
            color: "#111827",
          }}
        >
          {t("popularProducts")}
        </Typography>
      </Box>

      <StyledSwiper
        modules={[Navigation]}
        navigation
        loop
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          1024: { slidesPerView: 4 },
          680: { slidesPerView: 3 },
          440: { slidesPerView: 2 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Stack>
  );
};

export default PopularProducts;
