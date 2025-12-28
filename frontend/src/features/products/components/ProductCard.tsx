import { useNavigate } from "react-router-dom";
import type { Product } from "../../../types";
import { useWishlist } from "../hooks/useWishlist";
import { useProductDiscount } from "../hooks/useProductDiscount";
import type React from "react";
import { motion } from "framer-motion";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { ProductBadges } from "./ProductBadges";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import ProductImageSlider from "./ProductImageSlider";
import ProductPrice from "./ProductPrice";

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const navigate = useNavigate();

    const { isInWishlist, toggleWishlist } = useWishlist(product._id);
    const { hasActiveDiscount, timeLeft, finalPrice } =
        useProductDiscount(product);

    const MotionCard = motion(Card);

    const handleCardClick = () => {
        const identifier = product.slug || product._id;
        navigate(`/product/${identifier}`);
    };

    return (
        <MotionCard
            onClick={handleCardClick}
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
            <ProductBadges
                discount={hasActiveDiscount ? product.discount : undefined}
                isNew={product.isNew}
            />

            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(e);
                }}
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
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
            </IconButton>

            {hasActiveDiscount && timeLeft && (
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

            {product.images && product.images.length > 0 ? (
                <ProductImageSlider images={product.images} name={product.name} />
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

                <ProductPrice
                    price={product.price}
                    finalPrice={finalPrice ?? product.price}
                    showDiscount={hasActiveDiscount}
                />
            </CardContent>
        </MotionCard>
    );
};

export default ProductCard;