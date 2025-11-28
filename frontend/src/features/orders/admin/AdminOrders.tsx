import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchAdminOrders } from "./ordersThunks";
import { selectOrders, selectFetchingOrders } from "./ordersSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../../constants";

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const isLoading = useAppSelector(selectFetchingOrders);
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
            mb={3}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
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
                {t("customer")}: {order.user?.displayName || "N/A"}
              </Typography>
              <Typography variant="subtitle2">
                {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                {t("total")}: {order.totalPrice}₸
              </Typography>
            </Box>

            {order.items.map((item) => (
              <Box
                key={item.productId}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
                mb={1}
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
                <Box>
                  <Typography>{item.title}</Typography>
                  <Typography variant="body2">
                    {t("color")}: {item.selectedColor}
                  </Typography>
                  <Typography variant="body2">
                    {t("size")}: {item.selectedSize}
                  </Typography>
                  <Typography variant="body2">
                    {t("price")}: {item.price}₸
                  </Typography>
                  <Typography variant="body2">
                    {t("quantity")}: {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {t("total")}: {item.price * item.quantity}₸
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ))
      )}
    </>
  );
};

export default AdminOrders;
