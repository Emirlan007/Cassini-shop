import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    selectProduct,
    selectProductFetchError,
    selectProductFetchLoading,
} from "./productsSlice";
import {useEffect, useState} from "react";
import {fetchProductById} from "./productsThunks";
import {Box, Button, CircularProgress, Tab, Tabs, Typography} from "@mui/material";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import "swiper/swiper.css";
import {API_URL} from "../../constants";
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

    const {productId} = useParams() as { productId: string };
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [hasActiveDiscount, setHasActiveDiscount] = useState(false);

    const handleAddToCart = () => {
        if (!product || !selectedSize || !selectedColor) return;

        dispatch(addToCart({
            productId: product._id,
            title: product.name,
            price: product.price,
            quantity: 1,
            selectedColor: selectedColor,
            selectedSize: selectedSize,
            image: product!.images![0],
        }))

        toast.success("Товар добавлен в корзину!");
    };

    useEffect(() => {
        dispatch(fetchProductById(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        const checkDiscount = () => {
            if (product?.discount && product?.discountUntil) {
                const now = new Date();
                const discountUntil = new Date(product.discountUntil);

                if (discountUntil > now) {
                    setHasActiveDiscount(true);

                    const diff = discountUntil.getTime() - now.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    if (hours > 0) {
                        setTimeLeft(`${hours}ч ${minutes}м ${seconds}с`);
                    } else if (minutes > 0){
                        setTimeLeft(`${minutes}м ${seconds}с`);
                    } else {
                        setTimeLeft(`${seconds}с`);
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

    const calculateFinalPrice = () => {
        if (product?.discount && hasActiveDiscount) {
            return Math.round(product?.price * (1 - product?.discount / 100));
        }
        return product?.price;
    };

    const finalPrice = calculateFinalPrice();
    const showDiscount = product?.discount && hasActiveDiscount;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="inherit"/>
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
        <Box
            sx={{
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
                    navigation={true}
                    pagination={{clickable: true}}
                    className="mySwiper"
                >
                    {product?.video && (
                        <SwiperSlide key="video">
                            <Box sx={{height: {xs: 320, sm: 400}}}>
                                <video width="100%" height="100%" controls>
                                    <source src={API_URL + product.video} type="video/mp4"/>
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </Box>
                        </SwiperSlide>
                    )}
                    {product?.images.map((image) => (
                        <SwiperSlide key={image}>
                            <Box
                                sx={{
                                    height: {xs: 320, sm: 400},
                                }}
                            >
                                <img src={`${API_URL}${image.startsWith('/') ? image.slice(1) : image}`}
                                     alt={product.name}/>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            <Box
                sx={{
                width: { xs: "100%", md: "50%" },
                }}
            >
                <Typography variant="h6" sx={{marginBottom: 1}}>
                    <b>{product?.name}</b>
                </Typography>
                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                }}
                >
                    <Box sx={{
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
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    color: "#660033",
                                }}
                            >${product.price}
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

                    <Box sx={{
                        display: "block",
                        marginLeft: { xs: 0, sm: "auto" }
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

                {product.size?.length > 0 && (
                    <Box mt={3}>
                        <Typography
                            mb={1}
                            sx={{color: '#525252', fontSize: '14px', fontWeight: '400'}}
                        >
                            Размер:
                        </Typography>
                        <Tabs
                            value={selectedSize ?? false}
                            onChange={(_, v) => setSelectedSize(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                minHeight: 0,
                                "& .MuiTabs-flexContainer": {
                                    gap: "8px",
                                },
                                "& .MuiTabs-indicator": { display: "none" }
                            }}
                        >
                            {product.size.map((s) => (
                                <Tab
                                    key={s}
                                    value={s}
                                    label={s}
                                    sx={{
                                        minHeight: 0,
                                        minWidth: 0,
                                        px: 3,
                                        py: 1,
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        border: selectedSize === s ? "1px solid #000" : "1px solid #D9D9D9",
                                        backgroundColor: selectedSize === s ? "#F2F2F2" : "#fff",
                                        color: "#000 !important",

                                        "&.Mui-selected": {
                                            color: "#000"
                                        }
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                )}

                {product.colors?.length > 0 && (
                    <Box mt={3}>
                        <Typography
                            mb={1}
                            sx={{color: '#525252', fontSize: '14px', fontWeight: '400'}}
                        >
                            Цвет:
                        </Typography>

                        <Tabs
                            value={selectedColor ?? false}
                            onChange={(_, v) => setSelectedColor(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                minHeight: 0,
                                "& .MuiTabs-flexContainer": { gap: "10px" },
                                "& .MuiTabs-indicator": { display: "none" }
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
                                                border: selectedColor === c ? "2px solid #000" : "1px solid #ccc",
                                                padding: "3px",
                                                backgroundClip: "content-box",
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

                <Box>
                    <Typography variant={'h6'} sx={{marginY: 1, fontSize: '16px', fontWeight: '500'}}>Product Details</Typography>
                    <Typography variant="body1" sx={{color: '#525252', fontSize: '14px'}}>{product?.description}</Typography>
                </Box>

                <Box mt={4} display="flex" gap={2}>
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
                    <Button
                        variant="contained"
                        disabled={!selectedColor || !selectedSize}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                    {
                        user?.role === 'admin' ? (
                            <Button
                                variant="contained"
                                sx={{marginLeft: 'auto'}}
                                onClick={() => navigate(`/products/${product._id}/update`)}
                            >
                                Edit
                            </Button>
                        ) : null
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default ProductDetails;