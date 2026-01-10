import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import {
  fetchProductAnalytics,
  type ProductAnalyticsPeriod,
} from "./productAnalyticsThunks.ts";
import TableThumbnail from "../../../components/UI/TableThumbnail/TableThumbnail.tsx";
import { getImageUrl } from "../../../utils/getImageUrl.ts";

const ProductAnalytics = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.productAnalytics);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [period, setPeriod] = useState<ProductAnalyticsPeriod>("week");

  useEffect(() => {
    dispatch(fetchProductAnalytics({ period }));
  }, [dispatch, period]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Аналитика товаров
      </Typography>

      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
        sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
      >
        <ToggleButton value="day">День</ToggleButton>
        <ToggleButton value="week">Неделя</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
        <ToggleButton value="year">Год</ToggleButton>
        <ToggleButton value="all">Всё время</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {data.map((item) => (
            <Card key={item.productTitle}>
              <CardContent>
                <Typography fontWeight={600}>{item.productTitle}</Typography>

                <Typography variant="body2">
                  🛒 В корзину: {item.addToCartQty}
                </Typography>
                <Typography variant="body2">
                  ❤️ Вишлист: {item.wishlistCount}
                </Typography>
                <Typography variant="body2">
                  👀 Просмотры: {item.views}
                </Typography>
                <Typography variant="body2">
                  🔍 Показы в поиске: {item.searchImpressions}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Фото</TableCell>
              <TableCell>Название товара</TableCell>
              <TableCell align="right">В корзину</TableCell>
              <TableCell align="right">В вишлист</TableCell>
              <TableCell align="right">Просмотры</TableCell>
              <TableCell align="right">Показы в поиске</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableThumbnail
                  imageUrl={item.image ? getImageUrl(item.image) : undefined}
                />
                <TableCell>{item.productTitle}</TableCell>
                <TableCell align="right">{item.addToCartQty}</TableCell>
                <TableCell align="right">{item.wishlistCount}</TableCell>
                <TableCell align="right">{item.views}</TableCell>
                <TableCell align="right">{item.searchImpressions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ProductAnalytics;
