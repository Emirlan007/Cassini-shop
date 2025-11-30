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
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { clearCart, selectItems, selectTotalPrice } from "../cartSlice.ts";
import { createOrder } from "../../orders/ordersThunk.ts";
import toast from "react-hot-toast";

interface Props {
  onCheckout: (paymentData: {
    paymentMethod: "cash" | "qrCode";
    comment?: string;
  }) => void;
}

const PaymentStep: React.FC<Props> = ({ onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qrCode">("cash");
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  //   const handleCheckout = async () => {
  //     if (!user) {
  //       navigate("/register");
  //       return;
  //     }

  //     const orderItems = items.map((item) => ({
  //       product: item.productId,
  //       title: item.title,
  //       image: item.image,
  //       selectedColor: item.selectedColor,
  //       selectedSize: item.selectedSize,
  //       price: item.price,
  //       quantity: item.quantity,
  //     }));

  //     const orderData = {
  //       items: orderItems,
  //       totalPrice,
  //       paymentMethod,
  //     };

  //     try {
  //       await dispatch(createOrder(orderData)).unwrap();
  //       dispatch(clearCart());
  //       navigate("/account");
  //       toast.success("Заказ оформлен!");
  //     } catch (e) {
  //       console.error(e);
  //       toast.error("Ошибка при создании заказа");
  //     }
  //   };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" mb={2}>
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
          >
            Оформить заказ
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PaymentStep;
