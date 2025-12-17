import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {fetchOrderAnalytics} from "./orderAnalyticsThunks.ts";

const OrderAnalytics = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state) => state.orderAnalytics
  );

  const [period, setPeriod] = useState<
    "day" | "week" | "month" | "year" | "all"
  >("week");

  useEffect(() => {
    dispatch(fetchOrderAnalytics({ period }));
  }, [dispatch, period]);

  if (loading || !data) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Аналитика заказов
      </Typography>

      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
        sx={{ mb: 4 }}
      >
        <ToggleButton value="day">Сегодня</ToggleButton>
        <ToggleButton value="week">Неделя</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
        <ToggleButton value="year">Год</ToggleButton>
        <ToggleButton value="all">Всё время</ToggleButton>
      </ToggleButtonGroup>

      {loading || !data ? (
        <Typography>Загрузка...</Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Создано заказов"
                value={data.totals.ordersCreated}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Завершено"
                value={data.totals.ordersCompleted}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Отменено"
                value={data.totals.ordersCanceled}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Выручка"
                value={`${data.totals.revenue} ₸`}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Динамика заказов
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.items}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="ordersCreated"
                    name="Создано"
                  />
                  <Line
                    type="monotone"
                    dataKey="ordersCompleted"
                    name="Завершено"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default OrderAnalytics;