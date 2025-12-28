import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import CustomTabPanel from "../../../components/UI/Tabs/CustomTabPanel";
import theme from "../../../theme";
import a11yProps from "../../../components/UI/Tabs/AllyProps";
import { selectFetchingOrders, selectOrders } from "../admin/ordersSlice";
import { selectUser } from "../../users/usersSlice";
import OrderCard from "./OrderCard";
import { fetchAdminOrders } from "../admin/ordersThunks";

const OrderTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const orders = useAppSelector(selectOrders);
  const isLoading = useAppSelector(selectFetchingOrders);
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const fetchAllOrders = useCallback(async () => {
    await dispatch(fetchAdminOrders());
  }, [dispatch]);

  useEffect(() => {
    void fetchAllOrders();
  }, [fetchAllOrders]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredOrders = useMemo(() => {
    switch (tabValue) {
      case 0:
        return orders.filter((order) => order.status === "awaiting_payment");
      case 1:
        return orders.filter((order) => order.status === "paid");
      case 2:
        return orders.filter((order) => order.status === "canceled");
      default:
        return [];
    }
  }, [orders, tabValue]);

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          aria-label="basic tabs example"
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.main,
            },
            "& .Mui-selected": {
              color: `${theme.palette.secondary.main} !important`,
            },
          }}
        >
          <Tab label={t("awaitingPayment")} {...a11yProps(0)} />
          <Tab label={t("paid")} {...a11yProps(1)} />
          <Tab label={t("cancelled")} {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Typography>{t("noOrders")}</Typography>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isAdmin={user?.role === "admin"}
            />
          ))
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Typography>{t("noOrders")}</Typography>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isAdmin={user?.role === "admin"}
            />
          ))
        )}
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Typography>{t("noOrders")}</Typography>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isAdmin={user?.role === "admin"}
            />
          ))
        )}
      </CustomTabPanel>
    </Box>
  );
};

export default OrderTabs;
