import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectProduct,
  selectProductFetchError,
  selectProductFetchLoading,
} from "./productsSlice";
import { useEffect } from "react";
import { fetchProductById } from "./productsThunks";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper.css";
import { API_URL } from "../../constants";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);

  const { productId } = useParams() as { productId: string };

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error || !product?.images) {
    return (
      <Typography textAlign="center" mt={2}>
        Ошибка при загрузке товара: {error}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: { lg: "1200px", md: "800px", sm: "600px", xs: "320px" },
          mx: "auto",
          mt: 1,
          mb: 3,
        }}
      >
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {product?.images.map((image) => (
            <SwiperSlide key={image}>
              <Box
                sx={{
                  height: { xs: 320, sm: 400 },
                }}
              >
                <img src={API_URL + image} alt={product.name} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Typography variant="h6">
        <b>{product?.name}</b>
      </Typography>
      <Typography variant="h5">
        <b>{product?.price} ₸</b>
      </Typography>
      <Typography variant="body1">{product?.description}</Typography>
    </>
  );
};

export default ProductDetails;
