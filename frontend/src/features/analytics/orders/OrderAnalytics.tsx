import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead, TableCell, TableRow, TableBody, Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { fetchOrderAnalytics } from "./orderAnalyticsThunks.ts";
import {selectOrders} from "../../orders/admin/ordersSlice.ts";
import {fetchAdminOrders} from "../../orders/admin/ordersThunks.ts";
import {getOrderStatusColor} from "../../../utils/statusUtils.ts";
import {useTranslation} from "react-i18next";

const OrderAnalytics = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.orderAnalytics);
  const orders = useAppSelector(selectOrders);
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [period, setPeriod] = useState<
    "day" | "week" | "month" | "year" | "all"
  >("week");

  useEffect(() => {
    dispatch(fetchOrderAnalytics({ period }));
  }, [dispatch, period]);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  if (loading || !data) {
    return <Typography>Загрузка...</Typography>;
  }

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={600}
        gutterBottom
      >
        Аналитика заказов
      </Typography>

      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
        sx={{
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <ToggleButton value="day">День</ToggleButton>
        <ToggleButton value="week">Неделя</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
        <ToggleButton value="year">Год</ToggleButton>
        <ToggleButton value="all">Всё время</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Создано заказов" value={data.totals.ordersCreated} />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Оплачено" value={data.totals.ordersPaid} />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Отменено" value={data.totals.ordersCanceled} />
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Выручка" value={`${data.totals.revenue} сом`} />
        </Grid>
      </Grid>

      <Card sx={{ overflowX: "hidden" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Динамика заказов
          </Typography>

          <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
            <LineChart data={data.items}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? "preserveStartEnd" : 0}
                tickFormatter={(value: string) => value.slice(0, 10)}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="ordersCreated"
                name="Создано"
                stroke="#1976d2"
                strokeWidth={2}
                dot={!isMobile}
              />
              <Line
                type="monotone"
                dataKey="ordersPaid"
                name="Оплачено"
                stroke="#2e7d32"
                strokeWidth={2}
                dot={!isMobile}
              />
              <Line
                type="monotone"
                dataKey="ordersCanceled"
                name="Отменено"
                stroke="#d32f2f"
                strokeWidth={2}
                dot={!isMobile}
              />
            </LineChart>
          </ResponsiveContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <LegendItem color="#1976d2" label="Создано" />
            <LegendItem color="#2e7d32" label="Оплачено" />
            <LegendItem color="#d32f2f" label="Отменено" />

          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Таблица заказов
          </Typography>

          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Товары</TableCell>
                  <TableCell align="center">Кол-во</TableCell>
                  <TableCell align="right">Сумма</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{order._id}</TableCell>

                    <TableCell>
                      <Chip
                        label={t(order.status)}
                        color={getOrderStatusColor(order.status)}
                        sx={{ minWidth: "150px", height: "25px" }}
                      />
                    </TableCell>

                    <TableCell>
                      {order.items.map((item) => item.title).join(", ")}
                    </TableCell>

                    <TableCell align="center">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {order.totalPrice} сом
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const LegendItem = ({
                      color,
                      label,
                    }: {
  color: string;
  label: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
    <Typography variant="body2">{label}</Typography>
  </Box>
);

export default OrderAnalytics;
