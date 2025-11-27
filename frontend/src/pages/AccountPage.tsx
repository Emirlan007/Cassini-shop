import {fetchOrders} from "../features/orders/ordersThunk.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {selectIsLoading, selectOrders} from "../features/orders/ordersSlice.ts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Typography} from "@mui/material";
import OrderCard from "../features/orders/components/OrderCard.tsx";


const AccountPage = () => {
  const dispatch = useAppDispatch();
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
                    onClick={() => navigate(`/orders/${order._id}`)}
                />
            ))
        )}
      </>
  );
};

export default AccountPage;
