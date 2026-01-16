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
  CircularProgress,
  Typography,
} from "@mui/material";
import { History } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import OrderProduct from "../orders/components/OrderProduct.tsx";

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
        <>
          {history.map((item) => (
              <Card
                  key={item._id}
                  sx={{
                    cursor: "pointer",
                    padding: "20px",
                    transition: "transform 0.2s",
                    marginBottom: "15px",
                    backgroundColor: "white",
                    border: "1px solid #CCCCCC",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/order-history/${item._id}`)}
              >
                <Typography variant="subtitle2" flexGrow={1} sx={{mb: 2}}>
                  {t("createdAt")}: {new Date(item.completedAt).toLocaleString()}
                </Typography>

                {item.items.map((product, index) => (
                    <Box key={`${product.product}-${product.selectedColor}-${product.selectedSize}-${index}`}
                         mb={2}
                    >
                      <OrderProduct product={product} />
                    </Box>
                ))}
              </Card>
          ))}
        </>
      )}
    </Box>
  );
};

export default OrderHistoryPage;
