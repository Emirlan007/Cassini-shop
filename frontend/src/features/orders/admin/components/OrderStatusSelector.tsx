import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface OrderStatusSelectorProps {
  orderStatus: string;
  setOrderStatus: (status: string) => void;
  currentOrderStatus: string;
  onSubmit: () => void;
  loading?: boolean;
}

const OrderStatusSelector = ({
  orderStatus,
  setOrderStatus,
  currentOrderStatus,
  onSubmit,
  loading = false,
}: OrderStatusSelectorProps) => {
  const { t } = useTranslation();

  return (
    <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("orderStatus")}
      </Typography>

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t("orderStatus")}</InputLabel>
          <Select
            value={orderStatus}
            label={t("orderStatus")}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <MenuItem value="awaiting_payment">
              {t("awaiting_payment")}
            </MenuItem>
            <MenuItem value="paid">{t("paid")}</MenuItem>
            <MenuItem value="canceled">{t("canceled")}</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={orderStatus === currentOrderStatus || loading}
        >
          {loading ? <CircularProgress size={20} /> : t("edit")}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderStatusSelector;
