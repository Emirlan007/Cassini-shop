import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import {
  clearCart,
  removeFromCart,
  selectItems,
  selectTotalPrice,
  updateQuantity,
} from "./cartSlice.ts";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from "../../constants.ts";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CheckoutForm from "./components/CheckoutForm.tsx";
import PaymentStep from "./components/PaymentStep.tsx";
import {selectRegisterLoading, selectUpdateAddressLoading, selectUser} from "../users/usersSlice.ts";
import { createOrder } from "../orders/ordersThunk.ts";
import toast from "react-hot-toast";
import {registerThunk, updateUserAddress} from "../users/usersThunks.ts";
import CheckoutAddressForm from "./components/CheckoutAddressForm.tsx";
import Stepper from "./components/Stepper.tsx";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const user = useAppSelector(selectUser);
  const totalPrice = useAppSelector(selectTotalPrice);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const updateLoading = useAppSelector(selectUpdateAddressLoading)
  const { t } = useTranslation();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleRegister = async (userData: {
    name: string;
    phoneNumber: string;
    city: string;
    address: string;
  }) => {
    await dispatch(registerThunk(userData));
    setStep(3);
  };

  const handleAddressSubmit = async (userData: {
    city: string;
    address: string;
  }) => {
    if (!user?._id) {
      toast.error("Ошибка: пользователь не найден");
      return;
    }

    try {
      await dispatch(
          updateUserAddress({
            userId: user._id,
            city: userData.city,
            address: userData.address,
          })
      ).unwrap();

      setStep(3);
    } catch {
      toast.error("Ошибка при обновлении адреса");
    }
  };


  const handleCheckout = async (paymentData: {
    paymentMethod: "cash" | "qrCode";
    comment?: string;
  }) => {
    const orderData = {
      items,
      totalPrice,
      paymentMethod: paymentData.paymentMethod,
      userComment: paymentData.comment,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate("/account");
      toast.success("Заказ оформлен!");
    } catch (e) {
      console.error(e);
      toast.error("Ошибка при создании заказа");
    }
  };

  if (!items.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="70vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("emptyCart")}
        </Typography>
        <Typography variant="body1">
          {t("addProductToStartShopping")}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          {t("startShopping")}
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2} p={2}>

      <Stepper step={step} />

      {step === 1 && (
        <>
          <Typography
              sx={{
                fontWeight: '700',
                fontSize: '28px',
                marginBottom: '20px',
                color: '#660033'
              }}
          >
            Детали заказа
          </Typography>
          {items.map((item) => (
            <Box
              key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              p={1}
              border="1px solid #ccc"
              borderRadius={2}
              gap={1}
            >
              <img
                src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                alt={item.title}
                style={{
                  width: 160,
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Box flex={1}>
                <Typography fontWeight="bold" sx={{ xs: "h6", sm: "body1" }}>
                  {item.title}
                </Typography>
                <Typography variant="body2">
                  {t("color")}: {item.selectedColor}
                </Typography>
                <Typography variant="body2">
                  {t("size")}: {item.selectedSize}
                </Typography>
                <Typography variant="body2">
                  {t("price")}: {item.price}₸
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  size="small"
                  sx={{ color: "red", fontSize: 30, height: "30px" }}
                  onClick={() =>
                    dispatch(
                      updateQuantity({ ...item, quantity: item.quantity - 1 })
                    )
                  }
                >
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button
                  size="small"
                  sx={{ color: "red", fontSize: 20, height: "30px" }}
                  onClick={() =>
                    dispatch(
                      updateQuantity({ ...item, quantity: item.quantity + 1 })
                    )
                  }
                >
                  +
                </Button>
                <IconButton
                  color="error"
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: item.productId,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                      })
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Button
              variant="contained"
              sx={{
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                padding: '10px 0'
              }}
              onClick={() => {
                if (!user) {
                  setStep(2);
                } else if (!user.city || !user.address) {
                  setStep(2);
                } else {
                  setStep(3);
                }
              }}
          >
            Далее
          </Button>
        </>
      )}

      {step === 2 && (
          user ? (
              <CheckoutAddressForm
                  onSubmit={(data) => handleAddressSubmit(data)}
                  loading={updateLoading}
              />
          ) : (
              <CheckoutForm
                  onSubmit={(data) => handleRegister(data)}
                  loading={registerLoading}
              />
          )
      )}

      {step === 3 && <PaymentStep onCheckout={handleCheckout} />}
    </Stack>
  );
};

export default Cart;
