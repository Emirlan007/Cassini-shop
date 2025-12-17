import {
  Box,
  Stack,
  Step,
  StepLabel,
  Chip,
  Stepper,
  Typography,
} from "@mui/material";
import { API_URL, DeliveryStatus } from "../../../constants";
import { useTranslation } from "react-i18next";
import type { Order } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../users/usersSlice";
import theme from "../../../theme";

interface Props {
  order: Order;
  onClick?: () => void;
}

const OrderCard = ({ order, onClick }: Props) => {
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  const steps = Object.values(DeliveryStatus);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Оплачен";
      case "cancelled":
        return "Отменен";
      case "pending":
      default:
        return "Ожидает оплаты";
    }
  };

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
      onClick={onClick}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        mb={1}
        gap={1}
      >
        <Typography variant="subtitle2" flexGrow={1} sx={{ order: 1 }}>
          {t("orderNumber")}
          {order._id}
        </Typography>

        <Chip
          label={getPaymentStatusText(order.paymentStatus)}
          color={getPaymentStatusColor(order.paymentStatus)}
          size="small"
          sx={{
            maxWidth: "max-content",
            order: { xs: 3, sm: 2 },
          }}
        />

        <Typography variant="subtitle2" sx={{ order: { xs: 2, sm: 3 } }}>
          {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </Box>

      {order.items.map((item, index) => (
        <Box
          key={`${order._id}-${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          {item.image && (
            <img
              src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
              alt={item.title || "Product"}
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
            <Typography>{item.title}</Typography>
            <Typography variant="body2">
              <strong>{t("color")}</strong>: {item.selectedColor}
            </Typography>
            <Typography variant="body2">
              <strong>{t("size")}</strong>: {item.selectedSize}
            </Typography>
            <Typography variant="body2">
              <strong>{t("price")}</strong>: {item.price} сом
            </Typography>
            <Typography variant="body2">
              <strong>{t("quantity")}</strong>: {item.quantity}
            </Typography>
            <Typography variant="body2">
              <strong>{t("total")}</strong>: {item.price * item.quantity} сом
            </Typography>
          </Box>
        </Box>
      ))}

      {order.userComment && order.userComment.trim() !== "" && (
        <Stack>
          <Typography variant="body1">Комментарий</Typography>
          <Typography
            variant="body2"
            sx={{
              background: "#dddddd",
              borderRadius: 1,
              p: 0.5,
            }}
          >
            {order.userComment}
          </Typography>
        </Stack>
      )}

      <Box
        sx={{
          width: "100%",
          background: theme.palette.secondary.main,
          py: "1rem",
          borderRadius: "10%",
        }}
      >
        <Stepper
          activeStep={
            Object.values(DeliveryStatus).indexOf(order.deliveryStatus) + 1
          }
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "white !important",
                  },
                  "& .MuiStepIcon-root": {
                    color: "white",
                  },
                  "& .MuiStepIcon-text": {
                    fill: theme.palette.secondary.main,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {user?.role === "admin" && order.adminComments.length > 0 && (
        <Stack>
          <Typography variant="body1">Комментарии админа</Typography>
          {order.adminComments.map((comment) => (
            <Typography
              variant="body2"
              key={comment}
              sx={{
                background: "#dddddd",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              {comment}
            </Typography>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default OrderCard;
