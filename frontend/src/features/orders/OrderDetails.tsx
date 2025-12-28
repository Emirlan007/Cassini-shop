import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCreateUserCommentLoading,
  selectOrderDetails,
  selectOrderDetailsLoading,
} from "./ordersSlice";
import { useEffect, useState } from "react";
import { addUserCommentToOrder, fetchOrderById } from "./ordersThunk";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { selectUser } from "../users/usersSlice.ts";
import {
  addAdminCommentToOrder,
  changeOrderDeliveryStatus,
  updateOrderStatus,
} from "./admin/ordersThunks.ts";
import { selectCreateAdminCommentLoading } from "./admin/ordersSlice.ts";
import {
  getDeliveryStatusText,
  getDeliveryStatusColor,
  getOrderStatusText,
  getOrderStatusColor,
} from "../../utils/statusUtils.ts";
import DeliveryStatusSelector from "./admin/components/DeliveryStatusSelector.tsx";
import OrderStatusSelector from "./admin/components/OrderStatusSelector.tsx";
import OrderItem from "./components/OrderItem.tsx";
import UserCommentForm from "./components/UserCommentForm.tsx";
import AdminCommentForm from "./components/AdminCommentForm.tsx";
import CustomerInfo from "./components/CustomerInfo.tsx";

const OrderDetails = () => {
  const [deliveryStatus, setDeliveryStatus] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");

  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrderDetails);
  const loading = useAppSelector(selectOrderDetailsLoading);
  const createUserCommentLoading = useAppSelector(
    selectCreateUserCommentLoading
  );
  const createAdminCommentLoading = useAppSelector(
    selectCreateAdminCommentLoading
  );
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
    if (order?.status) {
      setOrderStatus(order.status);
    }
  }, [order]);

  const handleUserCommentSubmit = async (comment: string) => {
    await dispatch(addUserCommentToOrder({ comment, orderId }));
    await dispatch(fetchOrderById(orderId));
  };

  const handleAdminCommentSubmit = async (comment: string) => {
    await dispatch(addAdminCommentToOrder({ comment, orderId }));
    await dispatch(fetchOrderById(orderId));
  };

  const handleDeliveryStatusChange = async () => {
    if (orderId && deliveryStatus !== order?.deliveryStatus) {
      await dispatch(
        changeOrderDeliveryStatus({ orderId, value: deliveryStatus })
      );
      await dispatch(fetchOrderById(orderId));
    }
  };

  const handleOrderStatusChange = async () => {
    if (orderId && orderStatus !== order?.status) {
      await dispatch(updateOrderStatus({ orderId, status: orderStatus }));
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
              Статус заказа:
            </Typography>
            <Chip
              label={getOrderStatusText(order.status)}
              color={getOrderStatusColor(order.status)}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight="bold">
              Статус доставки:
            </Typography>
            <Chip
              label={getDeliveryStatusText(order.deliveryStatus)}
              color={getDeliveryStatusColor(order.deliveryStatus)}
            />
          </Box>
        </Box>

        {user?.role === "admin" && (
          <>
            <OrderStatusSelector
              orderStatus={orderStatus}
              setOrderStatus={setOrderStatus}
              currentOrderStatus={order.status}
              onSubmit={handleOrderStatusChange}
            />

            <DeliveryStatusSelector
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              currentDeliveryStatus={order.deliveryStatus}
              onSubmit={handleDeliveryStatusChange}
            />
          </>
        )}

        {user?.role === "admin" && order.user && (
          <CustomerInfo user={order.user} />
        )}

        {order.items.map((item, index) => (
          <OrderItem
            key={`${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
            item={item}
          />
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
            {order.totalPrice} сом
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
            <UserCommentForm
              onSubmit={handleUserCommentSubmit}
              loading={createUserCommentLoading}
            />
          )}

        {user?.role === "admin" && (
          <AdminCommentForm
            onSubmit={handleAdminCommentSubmit}
            loading={createAdminCommentLoading}
            existingComments={order.adminComments}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrderDetails;
