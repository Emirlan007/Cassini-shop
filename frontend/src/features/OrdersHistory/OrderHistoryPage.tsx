import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectOrderHistory,
  selectOrderHistoryLoading,
} from "./orderHistorySlice";
import { fetchMyOrderHistory } from "./orderHistoryThunks";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { History } from "@mui/icons-material";
import { API_URL } from "../../constants";
import { useTranslation } from "react-i18next";

const OrderHistoryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const history = useAppSelector(selectOrderHistory);
  const loading = useAppSelector(selectOrderHistoryLoading);

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchMyOrderHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        <History sx={{ mr: 1, verticalAlign: "middle" }} />
        {t("orderHistory")}
      </Typography>

      {history.length === 0 ? (
        <Typography>{t("youDontHaveAnyCompletedOrdersYet")}</Typography>
      ) : (
        <Grid container spacing={3}>
          {history.map((item) => (
            <Grid sx={{ xs: 12 }} key={item._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => navigate(`/order-history/${item._id}`)}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6">
                      {t("orderFrom")}{" "}
                      {new Date(item.completedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {item.totalPrice} сом
                    </Typography>
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    {item.items.slice(0, 4).map((product, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={`${API_URL}/${product.image.replace(
                            /^\/+/,
                            ""
                          )}`}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                    {item.items.length > 4 && (
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          backgroundColor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h6">
                          +{item.items.length - 4}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" mt={2}>
                    {item.items.length} товар(ов)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrderHistoryPage;
