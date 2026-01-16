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
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack data-testid="payment-step" spacing={3}>
        <Box>
          <Typography variant="h6" mb={2} color="#660033">
            {t("paymentMethod")}
          </Typography>

          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, value) => value && setPaymentMethod(value)}
            fullWidth
          >
            <ToggleButton data-testid="payment-cash" value="cash">{t("cash")}</ToggleButton>
            <ToggleButton data-testid="payment-qr" value="qrCode">{t("qrCode")}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          name="comment"
          data-testid="order-comment"
          label={t("orderComment")}
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("addComment")}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography data-testid="order-total" variant="h6">
            {t("total")}: {totalPrice} {t("som")}
          </Typography>

          <Button
            data-testid="place-order-button"
            variant="contained"
            onClick={() => onCheckout({ paymentMethod, comment })}
            sx={{
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              padding: "10px 20px",
            }}
          >
            {t("placeOrder")}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PaymentStep;
