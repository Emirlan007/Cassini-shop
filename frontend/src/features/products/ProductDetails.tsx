import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectProduct,
  selectProductFetchError,
  selectProductFetchLoading,
  selectProducts,
} from "./productsSlice";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import { fetchProductById, fetchProducts } from "./productsThunks";
import type { Swiper as SwiperType } from "swiper";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper.css";
import { API_URL } from "../../constants";
import { selectUser } from "../users/usersSlice.ts";
import { addToCart } from "../cart/cartSlice.ts";
import toast from "react-hot-toast";
import {
  selectAdminUpdateDiscountError,
  selectAdminUpdateDiscountLoading,
} from "./admin/adminProductsSlice.ts";
import { updateProductDiscount } from "./admin/adminProductsThunks.ts";
import ProductList from "./ProductsList.tsx";
import { AVAILABLE_SIZES } from "../../constants/sizes.ts";
import { convertSeconds } from "../../utils/dateFormatter.ts";
import theme from "../../theme.ts";
import CustomTabPanel from "../../components/UI/Tabs/CustomTabPanel.tsx";
import a11yProps from "../../components/UI/Tabs/AllyProps.tsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useTranslation } from "react-i18next";
import { findClosestColor } from "../../utils/colorNormalizer.ts";
import ThumbNail from "../../components/UI/ThumbNail/ThumbNail.tsx";

const ProductDetails = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);
  const user = useAppSelector(selectUser);
  const updateDiscountLoading = useAppSelector(
    selectAdminUpdateDiscountLoading
  );
  const updateDiscountError = useAppSelector(selectAdminUpdateDiscountError);
  const categoryProducts = useAppSelector(selectProducts);
  const { t } = useTranslation();

  const { productId } = useParams() as { productId: string };
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [hasActiveDiscount, setHasActiveDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [discountUntilValue, setDiscountUntilValue] = useState<string>("");

  const [tabValue, setTabValue] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const recommended = categoryProducts
    .filter((p) => p.category?._id === product?.category?._id)
    .filter((p) => p._id !== product?._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    dispatch(
      addToCart({
        productId: product._id,
        title: product.name,
        price: product.finalPrice!,
        quantity: 1,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        image: product!.images![0],
      })
    );

    toast.success("Товар добавлен в корзину!");
  };

  useEffect(() => {
    void dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.category?._id) {
      void dispatch(fetchProducts(product.category._id));
    }

    if (product) {
      const discount =
        typeof product.discount === "number" ? product.discount : 0;
      setDiscountValue(discount.toString());
      setDiscountUntilValue(
        product.discountUntil ? product.discountUntil.slice(0, 10) : ""
      );
    }
  }, [dispatch, product]);

  useEffect(() => {
    const checkDiscount = () => {
      if (product?.discount && product?.discountUntil) {
        const now = new Date();
        const discountUntil = new Date(product.discountUntil);

        if (discountUntil > now) {
          setHasActiveDiscount(true);
          const diff = discountUntil.getTime() - now.getTime();
          const { weeks, days, hours, minutes } = convertSeconds(diff);
          if (weeks > 0 || days > 0 || hours > 0 || minutes > 0) {
            const result = `${days > 0 && days + weeks * 7 + " d"} ${
              hours > 0 && hours + " h"
            } ${minutes > 0 && minutes + " m"}`;
            setTimeLeft(result);
          }
        } else {
          setHasActiveDiscount(false);
          setTimeLeft("");
        }
      } else {
        setHasActiveDiscount(false);
        setTimeLeft("");
      }
    };

    checkDiscount();
    const interval = setInterval(checkDiscount, 1000);

    return () => clearInterval(interval);
  }, [product?.discount, product?.discountUntil]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateFinalPrice = () => {
    if (product?.discount && hasActiveDiscount) {
      return Math.round(product?.price * (1 - product?.discount / 100));
    }
    return product?.price;
  };

  const finalPrice = calculateFinalPrice();
  const showDiscount = product?.discount && hasActiveDiscount;
  const todayDate = new Date().toISOString().split("T")[0];

  const handleDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === "") {
      setDiscountValue("");
      return;
    }

    const numericValue = Math.max(0, Math.min(100, Number(value)));
    setDiscountValue(numericValue.toString());
  };

  const getClothesColorName = (hex: string) => {
    const test = findClosestColor(hex);

    return t(`colors.${test}`);
  };

  const handleDiscountSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product || discountValue === "" || discountUntilValue === "") return;

    try {
      await dispatch(
        updateProductDiscount({
          productId: product._id,
          discountData: {
            discount: Number(discountValue),
            discountUntil: discountUntilValue,
          },
        })
      ).unwrap();
      toast.success("Скидка обновлена");
      await dispatch(fetchProductById(product._id));
    } catch {
      toast.error("Не удалось обновить скидку");
    }
  };

  const isDiscountValid =
    discountValue !== "" &&
    Number(discountValue) >= 0 &&
    Number(discountValue) <= 100 &&
    discountUntilValue !== "";

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

  const productAvailableSizes = product?.size || [];

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Swiper
            modules={[Pagination, Navigation]}
            navigation={false}
            className="mySwiper"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          >
            {product?.video && (
              <SwiperSlide key="video">
                <Box sx={{ height: { xs: 320, sm: 400 } }}>
                  <video
                    width="100%"
                    height="100%"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
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
                  <img
                    src={`${API_URL}${
                      image.startsWith("/") ? image.slice(1) : image
                    }`}
                    alt={product.name}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          <ThumbNail
            product={product}
            activeSlide={activeSlide}
            onThumbnailClick={handleThumbnailClick}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              <b>{product?.name}</b>
            </Typography>

            {product?.isNew && (
              <Box
                sx={{
                  backgroundColor: "secondary.main",
                  color: "white",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {t("new")}
              </Box>
            )}
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              {showDiscount ? (
                <>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#4B5563",
                      textDecoration: "line-through",
                    }}
                  >
                    {product.price} $
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#ff4444",
                    }}
                  >
                    {finalPrice} $
                  </Typography>
                </>
              ) : (
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "18px", sm: "24px" },
                    color: "#660033",
                  }}
                >
                  ${product.price}
                </Typography>
              )}

              {showDiscount && (
                <Typography
                  sx={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  -{product.discount}%
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "block",
                marginLeft: { xs: 0, sm: "auto" },
              }}
            >
              {showDiscount && timeLeft && (
                <Typography
                  sx={{
                    color: "red",
                    padding: "4px 8px",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  Осталось: {timeLeft}
                </Typography>
              )}
            </Box>
          </Box>
          {product.colors?.length > 0 && (
            <Box mt={3}>
              <Typography
                mb={1}
                sx={{ color: "#525252", fontSize: "14px", fontWeight: "400" }}
              >
                {t("color")}:{" "}
                <strong style={{ color: "black" }}>
                  {selectedColor && getClothesColorName(selectedColor)}
                </strong>
              </Typography>

              <Tabs
                value={selectedColor ?? false}
                onChange={(_, v) => setSelectedColor(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 0,
                  "& .MuiTabs-flexContainer": { gap: "10px" },
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.secondary.main,
                    height: 0,
                  },
                }}
              >
                {product.colors.map((c) => (
                  <Tab
                    key={c}
                    value={c}
                    label={
                      <Box
                        sx={{
                          width: 35,
                          height: 35,
                          borderRadius: "50%",
                          backgroundColor: c,
                          border:
                            selectedColor === c
                              ? `4px solid ${theme.palette.secondary.main}`
                              : "4px solid #ccc",
                          backgroundClip: "content-box",
                          transition: "border-color 0.3s ease-in-out",
                        }}
                      />
                    }
                    sx={{
                      minHeight: 0,
                      minWidth: 0,
                      padding: 0,
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          )}

          <Box mt={3}>
            <Typography
              mb={1}
              sx={{ color: "#525252", fontSize: "14px", fontWeight: "400" }}
            >
              {t("size")} :
            </Typography>
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              onChange={(_, value) => {
                if (value !== null && productAvailableSizes.includes(value)) {
                  setSelectedSize(value);
                }
              }}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid #D9D9D9",
                  borderRadius: "8px !important",
                  margin: 0,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  "&:not(:first-of-type)": {
                    marginLeft: 0,
                    borderLeft: "1px solid #D9D9D9",
                  },
                  "&.Mui-selected": {
                    border: "1px solid #000 !important",
                    backgroundColor: "#F2F2F2",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#F2F2F2",
                    },
                  },
                },
              }}
            >
              {AVAILABLE_SIZES.map((size) => {
                const isAvailable = productAvailableSizes.includes(size);
                const isSelected = selectedSize === size;

                return (
                  <ToggleButton
                    key={size}
                    value={size}
                    disabled={!isAvailable}
                    sx={{
                      textDecoration: isAvailable ? "" : "line-through",
                      color: isAvailable ? "#000" : "#999",
                      backgroundColor: isAvailable ? "#FFF" : "#F5F5F5",
                      cursor: isAvailable ? "pointer" : "default",
                      opacity: isAvailable ? 1 : 0.6,
                      "&:hover": {
                        backgroundColor: isAvailable
                          ? isSelected
                            ? "#F2F2F2"
                            : "#F9F9F9"
                          : "#F5F5F5",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#F2F2F2",
                        color: "#000",
                        "&.Mui-disabled": {
                          backgroundColor: "#F5F5F5",
                          color: "#999",
                        },
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#F5F5F5",
                        borderColor: "#E0E0E0",
                        color: "#999",
                      },
                    }}
                  >
                    {size}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>

            {productAvailableSizes.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  color: "#666",
                  fontSize: "12px",
                }}
              >
                {t("availableSizes")} {productAvailableSizes.join(", ")}
              </Typography>
            )}
            {product?.inStock && (
              <Typography
                sx={{
                  color: "green",
                  display: "block",
                  mt: 1,
                  fontWeight: 600,
                }}
              >
                {t("inStock")}
              </Typography>
            )}
            {selectedSize && !productAvailableSizes.includes(selectedSize) && (
              <Typography
                color="error"
                variant="caption"
                sx={{ display: "block", mt: 1 }}
              >
                Этот размер недоступен для данного товара
              </Typography>
            )}

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ display: "block", mt: 1 }}
              >
                Ошибка: {error}. Доступные размеры:{" "}
                {productAvailableSizes.join(", ") || "нет"}
              </Typography>
            )}
          </Box>
          <Box mt={4}>
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              alignItems="center"
              mb={user?.role === "admin" ? 2 : 0}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#660033",
                  display: { xs: "block", sm: "none" },
                  alignSelf: "center",
                }}
              >
                ${finalPrice}
              </Typography>
              <Box
                component="div"
                style={{ display: "flex", width: "100%", gap: "10px" }}
              >
                <Button
                  sx={{ width: "60%" }}
                  variant="contained"
                  disabled={!selectedColor || !selectedSize}
                  onClick={handleAddToCart}
                >
                  {t("addToCart")}
                </Button>
                <Button
                  sx={{
                    color: "#808080",
                    border: "1px solid #808080",
                    borderRadius: "10%",
                  }}
                >
                  <FavoriteBorderIcon />
                </Button>
              </Box>
            </Box>

            {user?.role === "admin" && (
              <Box
                component="form"
                onSubmit={handleDiscountSubmit}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", sm: "center" },
                  mt: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <TextField
                  label="Размер скидки (%)"
                  type="number"
                  value={discountValue}
                  onChange={handleDiscountChange}
                  required
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ flex: { xs: "1 1 auto", sm: "0 0 150px" } }}
                />
                <TextField
                  label="Действует до"
                  type="date"
                  value={discountUntilValue}
                  onChange={(event) =>
                    setDiscountUntilValue(event.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: todayDate }}
                  required
                  sx={{ flex: { xs: "1 1 auto", sm: "0 0 180px" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isDiscountValid || updateDiscountLoading}
                  sx={{
                    flex: { xs: "1 1 auto", sm: "0 0 200px" },
                    minHeight: "56px",
                  }}
                >
                  {updateDiscountLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Подтвердить скидку"
                  )}
                </Button>
              </Box>
            )}
          </Box>
          {user?.role === "admin" && updateDiscountError && (
            <Typography color="#F0544F" mt={1}>
              {updateDiscountError}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            aria-label="basic tabs example"
            onChange={handleChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.secondary.main,
              },
              "& .Mui-selected": {
                color: `${theme.palette.secondary.main} !important`,
              },
            }}
          >
            <Tab label={t("productDetail")} {...a11yProps(0)} />
            <Tab label={t("sizingGuide")} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Box>
            <Typography
              variant="body1"
              sx={{ color: "#525252", fontSize: "14px" }}
            >
              {product?.description}
            </Typography>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          Information about sizing and fit guide has not been added yet
        </CustomTabPanel>
      </Box>

      <Box marginTop={9}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "19px",
            lineHeight: "133%",
            textAlign: "center",
            color: "#111827",
            marginBottom: 3,
            marginTop: 5,
          }}
        >
          <b>{t("youMightAlsoLike")}</b>
        </Typography>

        <ProductList products={recommended} />
      </Box>
    </>
  );
};

export default ProductDetails;
