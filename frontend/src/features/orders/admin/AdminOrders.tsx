import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchAdminOrders } from "./ordersThunks";
import { selectOrders, selectFetchingOrders } from "./ordersSlice";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../../constants";
import { selectUser } from "../../users/usersSlice";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const isLoading = useAppSelector(selectFetchingOrders);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllOrders = useCallback(async () => {
    await dispatch(fetchAdminOrders());
  }, [dispatch]);

  useEffect(() => {
    void fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography>{t("noOrders")}</Typography>
      ) : (
        orders.map((order) => (
          <Box
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              mb={1}
              gap={0.5}
            >
              <Typography variant="subtitle2">
                {t("orderNumber")}: {order._id}
              </Typography>
              <Typography variant="subtitle2">
                {t("customer")}: {order.user?.name || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                {t("total")}: {order.totalPrice}⃀
              </Typography>
            </Box>

            {order.items.map((item, index) => (
              <Box
                key={`${order._id}-${item.productId}-${index}`}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
                mb={1}
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
                <Box>
                  <Typography>{item.title}</Typography>
                  <Typography variant="body2">
                    {t("color")}: {item.selectedColor}
                  </Typography>
                  <Typography variant="body2">
                    {t("size")}: {item.selectedSize}
                  </Typography>
                  <Typography variant="body2">
                    {t("price")}: {item.price}⃀
                  </Typography>
                  <Typography variant="body2">
                    {t("quantity")}: {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {t("total")}: {item.price * item.quantity}⃀
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
                    p: 1,
                    mb: 1,
                  }}
                >
                  {order.userComment}
                </Typography>
              </Stack>
            )}

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
        ))
      )}
    </>
  );
};

export default AdminOrders;
