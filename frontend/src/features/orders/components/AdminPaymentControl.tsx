import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearPaymentStatusError,
  selectUpdatePaymentStatusError,
  selectUpdatePaymentStatusLoading,
} from "../admin/ordersSlice";
import { updateOrderPaymentStatusThunk } from "../admin/ordersThunks";
import { fetchOrderById } from "../ordersThunk";

interface Props {
  orderId: string;
  currentPaymentStatus: "pending" | "paid" | "cancelled";
}

const AdminPaymentControl = ({ orderId, currentPaymentStatus }: Props) => {
  const dispatch = useAppDispatch();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "cancelled"
  >(currentPaymentStatus);

  const updatePaymentStatusLoading = useAppSelector(
    selectUpdatePaymentStatusLoading
  );
  const updatePaymentStatusError = useAppSelector(
    selectUpdatePaymentStatusError
  );

  useEffect(() => {
    setPaymentStatus(currentPaymentStatus);
  }, [currentPaymentStatus]);

  const handlePaymentStatusChange = async () => {
    if (orderId && paymentStatus !== currentPaymentStatus) {
      await dispatch(updateOrderPaymentStatusThunk({ orderId, paymentStatus }));
      await dispatch(fetchOrderById(orderId));
    }
  };

  return (
    <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление статусом оплаты
      </Typography>

      {updatePaymentStatusError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearPaymentStatusError())}
        >
          {updatePaymentStatusError}
        </Alert>
      )}

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус оплаты</InputLabel>
          <Select
            value={paymentStatus}
            label="Статус оплаты"
            onChange={(e) =>
              setPaymentStatus(
                e.target.value as "pending" | "paid" | "cancelled"
              )
            }
          >
            <MenuItem value="pending">Ожидает оплаты</MenuItem>
            <MenuItem value="paid">Оплачен</MenuItem>
            <MenuItem value="cancelled">Отменен</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handlePaymentStatusChange}
          disabled={
            paymentStatus === currentPaymentStatus || updatePaymentStatusLoading
          }
        >
          {updatePaymentStatusLoading ? (
            <CircularProgress size={20} />
          ) : (
            "Обновить"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPaymentControl;
