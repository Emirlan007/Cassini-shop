import { Box, Typography } from "@mui/material";
import { API_URL } from "../../../constants";
import { useTranslation } from "react-i18next";
import { type OrderItem as OrderItemType } from "../../../types";

interface Props {
  item: OrderItemType;
  index: number;
}

const OrderItem = ({ item, index }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      key={`${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
      display="flex"
      flexDirection="column"
      gap={3}
      mb={3}
      p={2}
      border="1px solid #ccc"
      borderRadius={2}
    >
      {item.image && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          sx={{
            height: { xs: 320, sm: 400 },
            width: "100%",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <img
            src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
            alt={item.title || "Product"}
            style={{
              objectFit: "contain",
              borderRadius: 8,
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
            }}
          />
        </Box>
      )}

      <Box>
        <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
          <b>{item.title}</b>
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {t("color")}: {item.selectedColor}
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {t("size")}: {item.selectedSize}
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {t("price")}: {item.price}₸
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {t("quantity")}: {item.quantity}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderItem;
