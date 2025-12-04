import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import type { Product } from "../../types";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {AnimatePresence, motion} from "framer-motion";

interface Props {
  product: Product;
}

const MotionCard = motion(Card);
const MotionCardMedia = motion('img');

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [hasActiveDiscount, setHasActiveDiscount] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
          void setHasActiveDiscount(true);

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

    const interval = setInterval(checkDiscount, 60000);

    return () => clearInterval(interval);
  }, [product.discount, product.discountUntil]);


    useEffect(() => {
        if (!isHovered || !product.images || product.images.length <= 1) return;

        const interval = setInterval(() => {
          setCurrentImageIndex(prev => (prev + 1) % product.images!.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered, product.images]);

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
        height: {
          xs: "auto",
          sm: "380px",
          md: "450px",
          lg: "504.2px",
        },
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

      <Box sx={{ position: "relative", width: "100%", height: { xs: "180px", sm: "240px", md: "320px", lg: "448px" } }}>
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
                    height: {
                      xs: "180px",
                      sm: "240px",
                      md: "320px",
                      lg: "448px",
                    },
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
