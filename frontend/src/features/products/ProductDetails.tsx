import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectProduct,
    selectProductFetchError,
    selectProductFetchLoading,
} from "./productsSlice";
import { useEffect, useState } from "react";
import { fetchProductById } from "./productsThunks";
import {Box, Button, Checkbox, CircularProgress, FormControlLabel, Popover, Typography} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper.css";
import { API_URL } from "../../constants";

const ProductDetails = () => {
    const dispatch = useAppDispatch();
    const product = useAppSelector(selectProduct);
    const loading = useAppSelector(selectProductFetchLoading);
    const error = useAppSelector(selectProductFetchError);

  const [sizeState, setSizeState] = useState<{
    anchor: HTMLElement | null;
    selected: string | null;
  }>({
    anchor: null,
    selected: null,
  });

  const [colorState, setColorState] = useState<{
    anchor: HTMLElement | null;
    selected: string | null;
  }>({
    anchor: null,
    selected: null,
  });

  const handleSizeClick = (e: React.MouseEvent<HTMLElement>) => {
    setSizeState((prev) => ({ ...prev, anchor: e.currentTarget }));
  };

  const handleColorClick = (e: React.MouseEvent<HTMLElement>) => {
    setColorState((prev) => ({ ...prev, anchor: e.currentTarget }));
  };

  const closeSize = () => {
    setSizeState((prev) => ({ ...prev, anchor: null }));
  };

  const closeColor = () => {
    setColorState((prev) => ({ ...prev, anchor: null }));
  };

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
                    modules={[Pagination, Navigation]}
                    navigation={true}
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

          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" onClick={handleSizeClick}>
              Размеры
            </Button>
            <Button variant="contained" onClick={handleColorClick}>
              Расцветки
            </Button>
          </Box>

          <Popover
              open={Boolean(sizeState.anchor)}
              anchorEl={sizeState.anchor}
              onClose={closeSize}
          >
            <Box p={2}>
              {(product.size || []).map((size) => (
                  <FormControlLabel
                      key={size}
                      control={
                        <Checkbox
                            checked={sizeState.selected === size}
                            onChange={() => {
                              setSizeState((prev) => ({ ...prev, selected: size }));
                              closeSize();
                            }}
                        />
                      }
                      label={size}
                  />
              ))}
            </Box>
          </Popover>

          <Popover
              open={Boolean(colorState.anchor)}
              anchorEl={colorState.anchor}
              onClose={closeColor}
          >
            <Box p={2}>
              {(product.colors || []).map((color) => (
                  <FormControlLabel
                      key={color}
                      control={
                        <Checkbox
                            checked={colorState.selected === color}
                            onChange={() => {
                              setColorState((prev) => ({ ...prev, selected: color }));
                              closeColor();
                            }}
                        />
                      }
                      label={color}
                  />
              ))}
            </Box>
          </Popover>
        </>
    );
};

export default ProductDetails;