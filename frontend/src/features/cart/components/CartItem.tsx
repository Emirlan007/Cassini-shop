import { Box, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "../../../constants.ts";
import { useTranslation } from "react-i18next";
import type { CartItem as CartItemType } from "../../../types";
import { trackAddToCart } from "../../../analytics/analytics.ts";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemove: (item: CartItemType) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      p={1}
      border="1px solid #ccc"
      borderRadius={2}
      gap={1}
    >
      <img
        src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
        alt={item.title}
        style={{
          width: 160,
          height: 160,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
      <Box flex={1}>
        <Typography fontWeight="bold" sx={{ xs: "h6", sm: "body1" }}>
          {item.title}
        </Typography>
        <Typography variant="body2">
          {t("color")}: {item.selectedColor}
        </Typography>
        <Typography variant="body2">
          {t("size")}: {item.selectedSize}
        </Typography>
        <Typography variant="body2">
          {t("price")}: {item.price} сом
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Button
          size="small"
          sx={{ color: "red", fontSize: 30, height: "30px" }}
          onClick={() => onUpdateQuantity(item, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <Typography>{item.quantity}</Typography>
        <Button
          size="small"
          sx={{ color: "red", fontSize: 20, height: "30px" }}
          onClick={() => {
            onUpdateQuantity(item, item.quantity + 1);
            trackAddToCart(item._id ?? "");
          }}
        >
          +
        </Button>
        <IconButton color="error" onClick={() => onRemove(item)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
