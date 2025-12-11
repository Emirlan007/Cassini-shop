import { Card, CardContent, Typography, Box, Stack, IconButton } from "@mui/material";
import type { Product } from "../../types";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { convertSeconds } from "../../utils/dateFormatter";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectWishlistProductIds } from "../wishlist/wishlistSlice";
import { addToWishlist, removeFromWishlist } from "../wishlist/wishlistThunks";
import { selectUser } from "../users/usersSlice";
import toast from "react-hot-toast";

interface Props {
    product: Product;
}

const MotionCard = motion(Card);
const MotionCardMedia = motion("img");

const ProductCard = ({ product }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const wishlistProductIds = useAppSelector(selectWishlistProductIds);

    const [timeLeft, setTimeLeft] = useState<string>("");
    const [hasActiveDiscount, setHasActiveDiscount] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
        return `${API_URL}${cleanPath}`;
    };

    useEffect(() => {
        setIsInWishlist(wishlistProductIds.includes(product._id));
    }, [wishlistProductIds, product._id]);

    useEffect(() => {
        const checkDiscount = () => {
            if (product.discount && product.discountUntil) {
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
        const interval = setInterval(checkDiscount, 60000);
        return () => clearInterval(interval);
    }, [product.discount, product.discountUntil]);

    useEffect(() => {
        if (!isHovered || !product.images || product.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered, product.images]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            toast.error("Войдите в аккаунт, чтобы добавить товар в избранное");
            navigate("/login");
            return;
        }

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product._id)).unwrap();
                toast.success("Товар удален из избранного");
            } else {
                await dispatch(addToWishlist(product._id)).unwrap();
                toast.success("Товар добавлен в избранное");
            }
        } catch (error) {
            toast.error("Произошла ошибка");
        }
    };

    const calculateFinalPrice = () => {
        if (product.discount && hasActiveDiscount) {
            return Math.round(product.price * (1 - product.discount / 100));
        }
        return product.price;
    };

    const finalPrice = calculateFinalPrice();
    const showDiscount = product.discount && hasActiveDiscount;

    return (
        <MotionCard
            onClick={() => navigate(`/product/${product._id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            sx={{
                width: "100%",
                maxWidth: { xs: "180px", sm: "220px", md: "280px", lg: "336px" },
                height: { xs: "auto", sm: "380px", md: "450px", lg: "504.2px" },
                borderRadius: "5px",
                border: "1px solid #f3f3f3",
                boxShadow: "none",
                backgroundColor: "#fff",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                mx: "auto",
                display: { xs: "block", md: "block" },
            }}
        >
            <Stack
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 1,
                }}
                direction="row"
                spacing={1}
            >
                {showDiscount && (
                    <Box
                        sx={{
                            backgroundColor: "#ff4444",
                            color: "white",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                        }}
                    >
                        -{product.discount}%
                    </Box>
                )}

                {product.isNew && (
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
                        New
                    </Box>
                )}
            </Stack>

            <IconButton
                onClick={handleWishlistToggle}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                }}
            >
                {isInWishlist ? (
                    <Favorite sx={{ color: "#ff4444" }} />
                ) : (
                    <FavoriteBorder />
                )}
            </IconButton>

            {showDiscount && timeLeft && (
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: 46, sm: 46, md: 46, lg: 46 },
                        left: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: { xs: "10px", sm: "12px" },
                        fontWeight: "bold",
                        zIndex: 1,
                    }}
                >
                    {timeLeft}
                </Box>
            )}

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "180px", sm: "240px", md: "320px", lg: "448px" },
                }}
            >
                <AnimatePresence mode="wait">
                    {product.images && product.images.length > 0 ? (
                        <MotionCardMedia
                            key={currentImageIndex}
                            src={getImageUrl(product.images[currentImageIndex])}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: { xs: "180px", sm: "240px", md: "320px", lg: "448px" },
                                backgroundColor: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#9ca3af",
                            }}
                        >
                            Нет изображения
                        </Box>
                    )}
                </AnimatePresence>
            </Box>

            <CardContent
                sx={{
                    p: { xs: 1, sm: 0 },
                    mt: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 0 },
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: "12.8px",
                        color: "#111827",
                        lineHeight: 1.3,
                        mb: "4px",
                    }}
                >
                    {product.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {showDiscount ? (
                        <>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "11.2px",
                                    color: "#4B5563",
                                    textDecoration: "line-through",
                                }}
                            >
                                {product.price} ₸
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "11.2px",
                                    color: "#ff4444",
                                }}
                            >
                                {finalPrice} ₸
                            </Typography>
                        </>
                    ) : (
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: "11.2px",
                                color: "#4B5563",
                            }}
                        >
                            {product.price} ₸
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </MotionCard>
    );
};

export default ProductCard;