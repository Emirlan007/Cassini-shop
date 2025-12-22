import { fetchOrders } from "../features/orders/ordersThunk.ts";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import {
  selectIsLoading,
  selectOrders,
} from "../features/orders/ordersSlice.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import OrderCard from "../features/orders/components/OrderCard.tsx";
import { Favorite } from "@mui/icons-material";
import { selectUser } from "../features/users/usersSlice.ts";

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectIsLoading);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <Typography>{t("loading")}</Typography>;

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Мой аккаунт
        </Typography>

        <Button
          variant="outlined"
          startIcon={<Favorite />}
          onClick={() => navigate("/wishlist")}
          sx={{
            mb: 3,
            borderColor: "#ff4444",
            color: "#ff4444",
            "&:hover": {
              borderColor: "#ff4444",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
            },
          }}
        >
          Избранное
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 2 }}>
        {t("yourOrders")}:
      </Typography>

      {orders.length === 0 ? (
        <Typography>{t("noOrders")}</Typography>
      ) : (
        orders.map((order) => (
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
