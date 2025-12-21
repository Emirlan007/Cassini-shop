import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrderDetails, selectOrderDetailsLoading } from "./ordersSlice";
import { useEffect, useState } from "react";
import { fetchOrderById } from "./ordersThunk";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { DeliveryStatus } from "../../constants";
import { useTranslation } from "react-i18next";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { selectUser } from "../users/usersSlice.ts";
import { changeOrderDeliveryStatus } from "./admin/ordersThunks.ts";
import {
  getPaymentStatusColor,
  getPaymentStatusText,
  getDeliveryStatusText,
} from "../../utils/statusUtils.ts";
import OrderItem from "./components/OrderItem.tsx";
import AdminPaymentControl from "./components/AdminPaymentControl.tsx";
import UserCommentForm from "./components/UserCommentForm.tsx";
import AdminCommentForm from "./components/AdminCommentForm.tsx";

const OrderDetails = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<string>("");

  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrderDetails);
  const loading = useAppSelector(selectOrderDetailsLoading);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  const { orderId } = useParams() as { orderId: string };

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order?.deliveryStatus) {
      setDeliveryStatus(order.deliveryStatus);
    }
  }, [order]);

  const handleDeliveryStatusChange = async () => {
    if (orderId && deliveryStatus !== order?.deliveryStatus) {
      await dispatch(
        changeOrderDeliveryStatus({ orderId, value: deliveryStatus })
      );
      await dispatch(fetchOrderById(orderId));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!order) {
    return (
      <Typography textAlign="center" mt={2}>
        {t("orderNotFound")}
      </Typography>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<NavigateBeforeIcon />}
        onClick={() => {
          if (window.history.state && window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/account");
          }
        }}
        sx={{ mb: 3 }}
        variant="contained"
      >
        {t("backToOrders")}
      </Button>

      <Box mb={4} p={3}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            {t("orderNumber")}
            {order._id}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Box
          mb={3}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight="bold">
              Статус оплаты:
            </Typography>
            <Chip
              label={getPaymentStatusText(order.paymentStatus)}
              color={getPaymentStatusColor(order.paymentStatus)}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight="bold">
              Статус доставки:
            </Typography>
            <Chip
              label={getDeliveryStatusText(order.deliveryStatus)}
              color="primary"
            />
          </Box>
        </Box>

        {user?.role === "admin" && (
          <>
            <AdminPaymentControl
              orderId={orderId}
              currentPaymentStatus={order.paymentStatus}
            />

            <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Управление статусом доставки
              </Typography>

              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Статус доставки</InputLabel>
                  <Select
                    value={deliveryStatus}
                    label="Статус доставки"
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                  >
                    {Object.keys(DeliveryStatus).map((item: string) => (
                      <MenuItem
                        key={item}
                        value={
                          DeliveryStatus[item as keyof typeof DeliveryStatus]
                        }
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleDeliveryStatusChange}
                  disabled={deliveryStatus === order.deliveryStatus}
                >
                  Обновить
                </Button>
              </Box>
            </Box>
          </>
        )}

        {user?.role === "admin" && order.user && (
          <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("customerInfo")}
            </Typography>

            <Typography variant="body1">
              <b>{t("displayName")}:</b> {order.user.name}
            </Typography>

            <Typography variant="body1">
              <b>{t("phoneNumber")}:</b> {order.user.phoneNumber}
            </Typography>
          </Box>
        )}

        {order.items.map((item, index) => (
          <OrderItem key={index} item={item} index={index} />
        ))}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          pt={2}
          borderTop="1px solid #e0e0e0"
        >
          <Typography variant="h6">{t("total")}:</Typography>
          <Typography variant="h5" fontWeight="bold">
            {order.totalPrice}₸
          </Typography>
        </Box>

        {order.userComment && order.userComment.trim() !== "" && (
          <Stack mt={3}>
            <Typography variant="h6">Комментарий</Typography>
            <Typography
              variant="body1"
              sx={{
                background: "#dddddd",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              {order.userComment}
            </Typography>
          </Stack>
        )}

        {user?._id === order.user?._id &&
          (!order.userComment || order.userComment.trim() === "") && (
            <UserCommentForm orderId={orderId} />
          )}

        {user?.role === "admin" && order.adminComments.length > 0 && (
          <Stack mt={3}>
            <Typography variant="h6">Комментарии админа</Typography>
            {order.adminComments.map((comment) => (
              <Typography
                variant="body1"
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

        {user?.role === "admin" && <AdminCommentForm orderId={orderId} />}
      </Box>
    </Box>
  );
};

export default OrderDetails;
