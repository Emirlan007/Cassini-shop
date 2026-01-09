import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Favorite, History } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { fetchOrders } from "../features/orders/ordersThunk.ts";
import {
  selectIsLoading,
  selectOrders,
} from "../features/orders/ordersSlice.ts";
import { selectUser } from "../features/users/usersSlice";
import OrderCard from "../features/orders/components/OrderCard.tsx";

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <Typography>{t("loading")}</Typography>;

  const activeOrders = orders.filter(
    (order) =>
      !(order.status === "paid" && order.deliveryStatus === "delivered")
  );

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          {t("profile")}
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Favorite />}
            onClick={() => navigate("/wishlist")}
            sx={{
              minWidth: 220,
              borderColor: "#ff4444",
              color: "#ff4444",
              "&:hover": {
                borderColor: "#ff4444",
                backgroundColor: "rgba(255, 68, 68, 0.1)",
              },
            }}
          >
            {t("wishlist")}
          </Button>

          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => navigate("/order-history")}
            sx={{
              minWidth: 220,
              borderColor: "#4CAF50",
              color: "#4CAF50",
              "&:hover": {
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
              },
            }}
          >
            {t("orderHistory")}
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {t("yourOrders")}:
      </Typography>

      {activeOrders.length === 0 ? (
        <Typography>{t("noOrders")}</Typography>
      ) : (
        activeOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isAdmin={user?.role === "admin"}
          />
        ))
      )}
    </>
  );
};

export default AccountPage;
