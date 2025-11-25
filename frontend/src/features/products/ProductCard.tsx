import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import type { Product } from "../../types";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
// import { useTranslation } from "react-i18next";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  // const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [hasActiveDiscount, setHasActiveDiscount] = useState(false);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return `${API_URL}${cleanPath}`;
  };

    useEffect(() => {
        const checkDiscount = () => {
            if (product.discount && product.discountUntil) {
                const now = new Date();
                const discountUntil = new Date(product.discountUntil);

                if (discountUntil > now) {
                    setHasActiveDiscount(true);

                    // Расчет оставшегося времени
                    const diff = discountUntil.getTime() - now.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                    if (hours > 0) {
                        setTimeLeft(`${hours}ч ${minutes}м`);
                    } else {
                        setTimeLeft(`${minutes}м`);
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

        // Обновляем таймер каждую минуту
        const interval = setInterval(checkDiscount, 60000);

        return () => clearInterval(interval);
    }, [product.discount, product.discountUntil]);

    // Расчет финальной цены (дублируем логику с бэка)
    const calculateFinalPrice = () => {
        if (product.discount && hasActiveDiscount) {
            return Math.round(product.price * (1 - product.discount / 100));
        }
        return product.price;
    };

    const finalPrice = calculateFinalPrice();
    const showDiscount = product.discount && hasActiveDiscount;

  return (
    <Card
        onClick={() => navigate(`/product/${product._id}`)}
        sx={{
            width: { xs: "100%", md: "336px" },
            height: { xs: "auto", md: "504.2px" },
            borderRadius: "5px",
            boxShadow: "none",
            backgroundColor: "#fff",
            cursor: "pointer",
            position: "relative",
      }}
    >

        {showDiscount && (
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor: "#ff4444",
                    color: "white",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 1,
                }}
            >
                -{product.discount}%
            </Box>
        )}

        {/* Таймер скидки */}
        {showDiscount && timeLeft && (
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 1,
                }}
            >
                {timeLeft}
            </Box>
        )}

      {product.images && product.images.length > 0 ? (
        <CardMedia
            component="img"
            image={getImageUrl(product.images[0])}
            alt={product.name}
            sx={{
                width: "100%",
                height: { xs: "auto", md: "448px" },
                objectFit: "cover",
                borderRadius: "5px",
            }}
        />
      ) : (
        <Box
            sx={{
                width: "100%",
                height: { xs: 200, md: "448px" },
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

      <CardContent sx={{ p: 0, mt: 1 }}>
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
    </Card>
  );
};

export default ProductCard;
