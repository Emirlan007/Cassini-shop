import { Box, Typography } from "@mui/material";
import type { OrderItem } from "../../../types";
import type React from "react";
import { API_URL } from "../../../constants";
import { useTranslation } from "react-i18next";

interface Props {
  product: OrderItem;
}

const OrderProduct: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={2}
    >
      {product.image && (
        <img
          src={`${API_URL}/${product.image.replace(/^\/+/, "")}`}
          alt={product.title || "Product"}
          style={{
            width: 160,
            height: 160,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography>{product.title}</Typography>

        <Box
          component="div"
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
        >
          <Typography variant="body2">
            <strong>{t("color")}:</strong>
          </Typography>
          <Box
            component="div"
            sx={{
              background: `${product.selectedColor}`,
              height: "1rem",
              width: "1rem",
              borderRadius: "50%",
              display: "",
            }}
          />
        </Box>

        <Typography variant="body2">
          <strong>{t("size")}</strong>: {product.selectedSize}
        </Typography>
        <Typography variant="body2">
          <strong>{t("price")}</strong>: {product.price} {t("som")}
        </Typography>
        <Typography variant="body2">
          <strong>{t("quantity")}</strong>: {product.quantity}
        </Typography>
        <Typography variant="body2">
          <strong>{t("total")}</strong>: {product.price * product.quantity}{" "}
          {t("som")}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderProduct;
