import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import type { Product } from "../../types";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return `${API_URL}${cleanPath}`;
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 300 },
        borderRadius: { xs: "12px", sm: "16px" },
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#FFFFFF",
        color: "#660033",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: { xs: "none", sm: "scale(1.02)" },
        },
      }}
    >
      {product.images && product.images.length > 0 ? (
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(product.images[0])}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          Нет изображения
        </Box>
      )}

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {product.name}
        </Typography>

        {product.description && (
          <Typography
            variant="body2"
            sx={{ mb: 1, fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
          >
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </Typography>
        )}

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          {product.price} ₸
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#660033",
            "&:hover": { backgroundColor: "#660033" },
            textTransform: "none",
            borderRadius: "8px",
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {t("moreDetails")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
