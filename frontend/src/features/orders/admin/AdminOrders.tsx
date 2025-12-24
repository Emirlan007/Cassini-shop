import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchAdminOrders } from "./ordersThunks";
import { selectOrders, selectFetchingOrders } from "./ordersSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import OrderCard from "../components/OrderCard";

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
          <OrderCard
            key={order._id}
            order={order}
          />
        ))
      )}
    </>
  );
};

export default AdminOrders;
