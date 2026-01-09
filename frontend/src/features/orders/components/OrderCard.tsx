import { Box, Chip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Order, OrderItemAdmin } from "../../../types";
import OrderProduct from "./OrderProduct";
import {
  getDeliveryStatusColor,
  getOrderStatusColor,
} from "../../../utils/statusUtils";
import OrderCardComments from "./OrderCardComments";
import { useNavigate } from "react-router-dom";

interface Props {
  order: Order | OrderItemAdmin;
  isAdmin: boolean;
}

const OrderCard = ({ order, isAdmin }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      key={order._id}
      mb={3}
      p={2}
      border="1px solid #ccc"
      borderRadius={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
      onClick={() => navigate(`/orders/${order._id}`)}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        mb={1}
        gap={1}
      >
        <Typography variant="subtitle2" flexGrow={1}>
          {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
        </Typography>

        <Chip
          label={t(order.deliveryStatus)}
          color={getDeliveryStatusColor(order.deliveryStatus)}
          sx={{ minWidth: "150px", height: "25px" }}
        />

        <Chip
          label={t(order.status)}
          color={getOrderStatusColor(order.status)}
          sx={{ minWidth: "150px", height: "25px" }}
        />
      </Box>

      {order.items.map((item, index) => (
        <OrderProduct
          key={`${order._id}-${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
          product={item}
        />
      ))}

      <OrderCardComments
        userComment={order.userComment}
        adminComments={isAdmin ? order.adminComments : undefined}
      />
    </Box>
  );
};
export default OrderCard;
