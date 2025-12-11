import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";
import { useAppSelector } from "../../../app/hooks.ts";
import React, { useState } from "react";
import { selectCart } from "../cartSlice.ts";

interface Props {
  onCheckout: (paymentData: {
    paymentMethod: "cash" | "qrCode";
    comment?: string;
  }) => void;
}

const PaymentStep: React.FC<Props> = ({ onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qrCode">("cash");
  const [comment, setComment] = useState("");

  const totalPrice = useAppSelector(selectCart)?.totalPrice;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" mb={2} color="#660033">
            Способ оплаты
          </Typography>

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, value) => value && setPaymentMethod(value)}
            fullWidth
          >
            <ToggleButton value="cash">Наличные</ToggleButton>
            <ToggleButton value="qrCode">QR-код</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          label="Комментарий к заказу"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Добавьте комментарий..."
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Итого: {totalPrice}₸</Typography>

          <Button
            variant="contained"
            onClick={() => onCheckout({ paymentMethod, comment })}
            sx={{
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              padding: "10px 20px",
            }}
          >
            Оформить заказ
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PaymentStep;
