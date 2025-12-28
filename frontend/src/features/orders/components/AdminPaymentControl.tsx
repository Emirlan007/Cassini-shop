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
import { useAppDispatch } from "../../../app/hooks";
import { clearPaymentStatusError } from "../admin/ordersSlice";

interface AdminPaymentControlProps {
  paymentStatus: "pending" | "paid" | "cancelled";
  setPaymentStatus: (status: "pending" | "paid" | "cancelled") => void;
  currentPaymentStatus: "pending" | "paid" | "cancelled";
  onSubmit: () => void;
  updatePaymentStatusLoading: boolean;
  updatePaymentStatusError: string | null;
}

const AdminPaymentControl = ({
  paymentStatus,
  setPaymentStatus,
  currentPaymentStatus,
  onSubmit,
  updatePaymentStatusLoading,
  updatePaymentStatusError,
}: AdminPaymentControlProps) => {
  const dispatch = useAppDispatch();

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
          onClick={onSubmit}
          disabled={
            paymentStatus === currentPaymentStatus ||
            updatePaymentStatusLoading
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
