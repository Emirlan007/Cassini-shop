import { Box, Chip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Order, OrderItemAdmin } from "../../../types";
import OrderProduct from "./OrderProduct";
import {
  getDeliveryStatusColor,
  getDeliveryStatusText,
  getPaymentStatusColor,
  getPaymentStatusText,
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            order: { xs: 1, sm: 2 },
          }}
        >
            <Box
                display="flex"
                flexDirection={{xs: "column", sm: "row"}}
                justifyContent="space-between"
                alignItems={{sm: "center"}}
                mb={1}
                gap={1}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        order: {xs: 1, sm: 2},
                    }}
                >
                    <Chip
                        label={getDeliveryStatusText(order.deliveryStatus)}
                        color={getDeliveryStatusColor(order.deliveryStatus)}
                        sx={{width: '150px', height: '25px'}}
                    />
                    <Chip
                        label={getPaymentStatusText(order.paymentStatus)}
                        color={getPaymentStatusColor(order.paymentStatus)}
                        sx={{width: '150px', height: '25px'}}
                    />
                </Box>
            </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ order: { xs: 2, sm: 3 } }}>
            {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Box>
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
    </Box>
  );
};

export default OrderCard;
