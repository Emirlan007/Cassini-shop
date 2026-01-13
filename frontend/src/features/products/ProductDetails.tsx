import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useProductDetails } from "./hooks/useProductDetails";
import { useProductDiscount } from "./hooks/useProductDiscount";
import { useProductVariants } from "./hooks/useProductVariants";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductMediaSlider from "./components/ProductMediaSlider";
import ProductInfo from "./components/ProductInfo";
import ProductList from "./ProductsList";
import ProductActions from "./components/ProductActions";
import ProductTabs from "./components/ProductTabs";
import { ProductVariants } from "./components/ProductVariants";
import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice";
import { trackProductView } from "../../analytics/analytics";
import { ProductSchema } from "./ProductSchema";
import {useTranslation} from "react-i18next";

const ProductDetails = () => {
  const { productSlug } = useParams() as { productSlug: string };

  const user = useAppSelector(selectUser);

  const { product, loading, error, recommended } =
    useProductDetails(productSlug);

  const { selectedColor, setSelectedColor, selectedSize, setSelectedSize } =
    useProductVariants(product ?? undefined);

  const { hasActiveDiscount, timeLeft, finalPrice } = useProductDiscount(
    product ?? undefined
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (product) {
      trackProductView(product?._id);
    }
    setSelectedColor(false);
    setSelectedSize(null);
  }, [productSlug]);

  const handleColorChange = (color: string) => {
    setSelectedColor((prev) => (prev === color ? false : color));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Typography textAlign="center" mt={2}>
        {t("productsLoadError")}
      </Typography>
    );
  }

  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name}</title>
          <meta
            name="description"
            content={
              product.description
                ? product.description.slice(0, 160)
                : product.name
            }
          />

          <meta property="og:title" content={product.name} />
          <meta
            property="og:description"
            content={
              product.description
                ? product.description.slice(0, 200)
                : product.name
            }
          />
          {product.images?.[0] && (
            <meta property="og:image" content={product.images[0]} />
          )}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
      )}

      <Box
        sx={{
          display: "flex",
          position: "relative",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <ProductMediaSlider product={product} selectedColor={selectedColor} />

        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <ProductInfo
            product={product}
            finalPrice={finalPrice ?? product.price}
            showDiscount={Boolean(hasActiveDiscount)}
            timeLeft={timeLeft}
          />

          <ProductVariants
            colors={product.colors}
            sizes={product.size}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={handleColorChange}
            onSizeChange={setSelectedSize}
          />

          <ProductActions
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            finalPrice={finalPrice}
            isAdmin={user?.role === "admin"}
          />
        </Box>
      </Box>

      <ProductTabs description={product.description} />
      <ProductList products={recommended} />
      <ProductSchema product={product} />
    </>
  );
};

export default ProductDetails;
