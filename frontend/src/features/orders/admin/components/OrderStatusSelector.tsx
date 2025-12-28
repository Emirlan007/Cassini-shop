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
  return (
    <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление статусом заказа
      </Typography>

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус заказа</InputLabel>
          <Select
            value={orderStatus}
            label="Статус заказа"
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <MenuItem value="pending">Ожидает обработки</MenuItem>
            <MenuItem value="completed">Завершен</MenuItem>
            <MenuItem value="canceled">Отменен</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={orderStatus === currentOrderStatus || loading}
        >
          {loading ? <CircularProgress size={20} /> : "Обновить"}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderStatusSelector;
