import {useNavigate, useParams} from "react-router-dom";
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
import {selectUser} from "../users/usersSlice.ts";
import {addToCart} from "../cart/cartSlice.ts";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const { productId } = useParams() as { productId: string };
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

    const handleAddToCart = () => {

        if (!product || !sizeState.selected || !colorState.selected) return;

        dispatch(addToCart({
            productId: product._id,
            title: product.name,
            price: product.price,
            quantity: 1,
            selectedColor: colorState.selected,
            selectedSize: sizeState.selected,
            image: product!.images![0],
        }))

        toast.success("Товар добавлен в корзину!");
    };

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
                    {product?.video && (
                        <SwiperSlide key="video">
                            <Box sx={{ height: { xs: 320, sm: 400 } }}>
                                <video width="100%" height="100%" controls>
                                    <source src={API_URL + product.video} type="video/mp4" />
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </Box>
                        </SwiperSlide>
                    )}

                    {product?.images.map((image) => (
                        <SwiperSlide key={image}>
                            <Box
                                sx={{
                                    height: { xs: 320, sm: 400 },
                                }}
                            >
                                <img src={`${API_URL}${image.startsWith('/') ? image.slice(1) : image}`} alt={product.name} />
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
              <Button
                  variant="contained"
                  sx={{marginLeft: 'auto'}}
                  disabled={!colorState.selected || !sizeState.selected}
                  onClick={handleAddToCart}
              >
                  Add to Cart
              </Button>
              {
                  user?.role === 'admin' ? <Button variant="contained" sx={{marginLeft: '10px'}} onClick={() => navigate(`/products/${product._id}/update`)}>Edit</Button> : null
              }
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
                      label={
                        <Box display="flex" alignItems="center">
                          {color}
                          <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                backgroundColor: color,
                                border: "1px solid #ccc",
                                ml: 1,
                              }}
                          />
                        </Box>
                      }
                  />
              ))}
            </Box>
          </Popover>
        </>
    );
};

export default ProductDetails;
