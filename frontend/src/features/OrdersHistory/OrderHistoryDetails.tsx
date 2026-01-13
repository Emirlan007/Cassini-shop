import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSelectedHistory,
  selectSelectedHistoryLoading,
} from "./orderHistorySlice";
import { fetchOrderHistoryById } from "./orderHistoryThunks";
import { Box, Button, CircularProgress, Typography, Chip } from "@mui/material";
import { NavigateBefore, CheckCircle } from "@mui/icons-material";
import { API_URL } from "../../constants";
import { useTranslation } from "react-i18next";

const OrderHistoryDetails = () => {
  const { historyId } = useParams<{ historyId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const history = useAppSelector(selectSelectedHistory);
  const loading = useAppSelector(selectSelectedHistoryLoading);

  const { t } = useTranslation();

  useEffect(() => {
    if (historyId) {
      dispatch(fetchOrderHistoryById(historyId));
    }
  }, [dispatch, historyId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!history) {
    return (
      <Typography textAlign="center" mt={2}>
        {t("historyEntryNotFound")}
      </Typography>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<NavigateBefore />}
        onClick={() => navigate("/order-history")}
        sx={{ mb: 3 }}
        variant="contained"
      >
        {t("backToHistory")}
      </Button>

      <Box mb={4} p={3}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ sm: "center" }}
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            {t("completedOrder")}
          </Typography>
          <Chip
            icon={<CheckCircle />}
            label={t("deliveredAndPaidFor")}
            color="success"
            sx={{ mt: { xs: 1, sm: 0 } }}
          />
        </Box>

        <Typography variant="body1" color="text.secondary" mb={3}>
          {t("completed")}: {new Date(history.completedAt).toLocaleString()}
        </Typography>

        <Box mb={3}>
          <Typography variant="body1">
            <strong>{t("paymentMethod")}:</strong>{" "}
            {history.paymentMethod === "cash" ? t("cash") : t("qrCode")}
          </Typography>
        </Box>

        {history.items.map((item, index) => (
          <Box
            key={`${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
            display="flex"
            flexDirection="column"
            gap={3}
            mb={3}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
          >
            {item.image && (
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                sx={{
                  height: { xs: 320, sm: 400 },
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                <img
                  src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                  alt={item.title || "Product"}
                  style={{
                    objectFit: "contain",
                    borderRadius: 8,
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                />
              </Box>
            )}

            <Box>
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
                <b>{item.title}</b>
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("color")}: {item.selectedColor}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("size")}: {item.selectedSize}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("price")}: {item.price} {t("som")}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("quantity")}: {item.quantity}
              </Typography>

              {item.finalPrice !== item.price && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {t("finalPrice")}: {item.finalPrice}₸
                </Typography>
              )}
            </Box>
          </Box>
        ))}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          pt={2}
          borderTop="1px solid #e0e0e0"
        >
          <Typography variant="h6">{t("total")}:</Typography>
          <Typography variant="h5" fontWeight="bold">
            {history.totalPrice} {t("som")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderHistoryDetails;
