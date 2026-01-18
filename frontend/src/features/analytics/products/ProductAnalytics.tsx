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
import { useTranslation } from "react-i18next";

const ProductAnalytics = () => {
  const { t } = useTranslation();
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
        {t("analytics.productsTitle")}
      </Typography>

      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
        sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
      >
        <ToggleButton value="day">{t("analytics.day")}</ToggleButton>
        <ToggleButton value="week">{t("analytics.week")}</ToggleButton>
        <ToggleButton value="month">{t("analytics.month")}</ToggleButton>
        <ToggleButton value="year">{t("analytics.year")}</ToggleButton>
        <ToggleButton value="all">{t("analytics.allTime")}</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Typography>{t("loading")}</Typography>
      ) : isMobile ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {data.map((item) => (
            <Card key={item.productTitle}>
              <CardContent>
                <Typography fontWeight={600}>{item.productTitle}</Typography>

                <Typography variant="body2">
                  🛒 {t("analytics.addedToCart")}: {item.addToCartQty}
                </Typography>
                <Typography variant="body2">
                  ❤️ {t("analytics.wishlist")}: {item.wishlistCount}
                </Typography>
                <Typography variant="body2">
                  👀 {t("analytics.views")}: {item.views}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("analytics.photo")}</TableCell>
              <TableCell>{t("analytics.productName")}</TableCell>
              <TableCell align="right">{t("analytics.toCart")}</TableCell>
              <TableCell align="right">{t("analytics.toWishlist")}</TableCell>
              <TableCell align="right">{t("analytics.views")}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ProductAnalytics;
