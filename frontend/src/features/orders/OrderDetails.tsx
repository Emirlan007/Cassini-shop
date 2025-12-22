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
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { API_URL } from "../../constants";
import { useTranslation } from "react-i18next";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { selectUser } from "../users/usersSlice.ts";
import {
  addAdminCommentToOrder,
  changeOrderDeliveryStatus,
  updateOrderPaymentStatusThunk,
} from "./admin/ordersThunks.ts";
import {
  clearPaymentStatusError,
  selectCreateAdminCommentLoading,
  selectUpdatePaymentStatusError,
  selectUpdatePaymentStatusLoading,
} from "./admin/ordersSlice.ts";
import {
  getPaymentStatusColor,
  getPaymentStatusText,
  getDeliveryStatusText, getDeliveryStatusColor,
} from "../../utils/statusUtils.ts";
import DeliveryStatusSelector from "./admin/components/DeliveryStatusSelector.tsx";

const OrderDetails = () => {
  const [userComment, setUserComment] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "cancelled"
  >("pending");
  const [deliveryStatus, setDeliveryStatus] = useState<string>("");

  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrderDetails);
  const loading = useAppSelector(selectOrderDetailsLoading);
  const createUserCommentLoading = useAppSelector(
    selectCreateUserCommentLoading
  );
  const createAdminCommentLoading = useAppSelector(
    selectCreateAdminCommentLoading
  );
  const updatePaymentStatusLoading = useAppSelector(
    selectUpdatePaymentStatusLoading
  );
  const updatePaymentStatusError = useAppSelector(
    selectUpdatePaymentStatusError
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
    if (order?.paymentStatus) {
      setPaymentStatus(order.paymentStatus);
    }
    if (order?.deliveryStatus) {
      setDeliveryStatus(order.deliveryStatus);
    }
  }, [order]);

  const handleUserCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await dispatch(addUserCommentToOrder({ comment: userComment, orderId }));
    await dispatch(fetchOrderById(orderId));
  };

  const handleAdminCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await dispatch(addAdminCommentToOrder({ comment: adminComment, orderId }));
    await dispatch(fetchOrderById(orderId));
  };

  const handlePaymentStatusChange = async () => {
    if (orderId && paymentStatus !== order?.paymentStatus) {
      await dispatch(updateOrderPaymentStatusThunk({ orderId, paymentStatus }));
      await dispatch(fetchOrderById(orderId));
    }
  };

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
              color={getDeliveryStatusColor(order.deliveryStatus)}
            />
          </Box>
        </Box>

        {user?.role === "admin" && (
          <>
            <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Управление статусом оплаты
              </Typography>

              {updatePaymentStatusError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  onClose={() => dispatch(clearPaymentStatusError())}
                >
                  {updatePaymentStatusError}
                </Alert>
              )}

              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Статус оплаты</InputLabel>
                  <Select
                    value={paymentStatus}
                    label="Статус оплаты"
                    onChange={(e) =>
                      setPaymentStatus(
                        e.target.value as "pending" | "paid" | "cancelled"
                      )
                    }
                  >
                    <MenuItem value="pending">Ожидает оплаты</MenuItem>
                    <MenuItem value="paid">Оплачен</MenuItem>
                    <MenuItem value="cancelled">Отменен</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handlePaymentStatusChange}
                  disabled={
                    paymentStatus === order.paymentStatus ||
                    updatePaymentStatusLoading
                  }
                >
                  {updatePaymentStatusLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Обновить"
                  )}
                </Button>
              </Box>
            </Box>

            <DeliveryStatusSelector
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              currentDeliveryStatus={order.deliveryStatus}
              onSubmit={handleDeliveryStatusChange}
            />
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
            <Stack
              onSubmit={handleUserCommentSubmit}
              component="form"
              direction="row"
              spacing={1}
              mt={3}
            >
              <TextField
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Комментарий к заказу"
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={userComment.trim() === ""}
              >
                {createUserCommentLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Отправить"
                )}
              </Button>
            </Stack>
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

        {user?.role === "admin" && (
          <Stack
            onSubmit={handleAdminCommentSubmit}
            component="form"
            direction="row"
            spacing={1}
            mt={3}
          >
            <TextField
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Комментарий к заказу"
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={adminComment.trim() === ""}
            >
              {createAdminCommentLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Отправить"
              )}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default OrderDetails;
