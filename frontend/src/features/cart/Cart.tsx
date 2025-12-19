import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { clearCart, selectCart } from "./cartSlice.ts";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { API_URL } from "../../constants.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import CheckoutForm from "./components/CheckoutForm.tsx";
import PaymentStep from "./components/PaymentStep.tsx";
import {
  selectRegisterLoading,
  selectUpdateAddressLoading,
  selectUser,
} from "../users/usersSlice.ts";
import { createOrder } from "../orders/ordersThunk.ts";
import toast from "react-hot-toast";
import { registerThunk, updateUserAddress } from "../users/usersThunks.ts";
import CheckoutAddressForm from "./components/CheckoutAddressForm.tsx";
import Stepper from "./components/Stepper.tsx";
import {
  deleteCart,
  fetchCart,
  removeItem,
  updateItemQuantity,
} from "./cartThunks.ts";
import type { CartItem } from "../../types";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCart)?.items ?? [];
  const user = useAppSelector(selectUser);
  const totalPrice = useAppSelector(selectCart)?.totalPrice ?? 0;
  const registerLoading = useAppSelector(selectRegisterLoading);
  const updateLoading = useAppSelector(selectUpdateAddressLoading);
  const { t } = useTranslation();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (item: CartItem) => {
    await dispatch(updateItemQuantity(item));
    await dispatch(fetchCart());
  };

  const handleRemoveItem = async (item: CartItem) => {
    await dispatch(removeItem(item));
    await dispatch(fetchCart());
  };

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
    name: string;
    phoneNumber: string;
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
            name: userData.name,
            phoneNumber: userData.phoneNumber,
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
    if (items.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    const orderItems = items.map((item) => ({
      product: item.product,
      title: item.title,
      image: item.image,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      price: item.price,
      finalPrice: item.finalPrice,
      quantity: item.quantity,
    }));

    try {
      await dispatch(
          createOrder({
            items: orderItems,
            totalPrice: totalPrice,
            paymentMethod: paymentData.paymentMethod,
            userComment: paymentData.comment,
          })
      ).unwrap();
      await dispatch(deleteCart());
      dispatch(clearCart());
      navigate("/account");
      toast.success("Заказ оформлен!");
    } catch (e) {
      console.error(e);
      toast.error("Ошибка при создании заказа");
    }
  };

  if (items.length === 0) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            p={3}
        >
          <ShoppingCartOutlinedIcon
              sx={{
                fontSize: 120,
                color: "#660033",
                opacity: 0.3,
                mb: 3,
              }}
          />
          <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#660033",
                mb: 2,
                textAlign: "center",
              }}
          >
            Ваша корзина пуста
          </Typography>
          <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                textAlign: "center",
                maxWidth: 400,
              }}
          >
            Добавьте товары в корзину, чтобы оформить заказ
          </Typography>
          <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                padding: "12px 48px",
                backgroundColor: "#660033",
                "&:hover": {
                  backgroundColor: "#4d0026",
                },
              }}
          >
            На главную
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
                    fontWeight: "700",
                    fontSize: "28px",
                    marginBottom: "20px",
                    color: "#660033",
                  }}
              >
                Детали заказа
              </Typography>
              {items.map((item) => (
                  <Box
                      key={`${item.product}-${item.selectedColor}-${item.selectedSize}`}
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
                        {t("price")}: {item.price}сом
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Button
                          size="small"
                          sx={{ color: "red", fontSize: 30, height: "30px" }}
                          onClick={() =>
                              handleUpdateQuantity({
                                ...item,
                                quantity: item.quantity - 1,
                              })
                          }
                      >
                        -
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                          size="small"
                          sx={{ color: "red", fontSize: 20, height: "30px" }}
                          onClick={() =>
                              handleUpdateQuantity({
                                ...item,
                                quantity: item.quantity + 1,
                              })
                          }
                      >
                        +
                      </Button>
                      <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
              ))}
              <Button
                  variant="contained"
                  sx={{
                    borderRadius: "14px",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "10px 0",
                  }}
                  disabled={items.length === 0}
                  onClick={() => setStep(2)}
              >
                Далее
              </Button>
            </>
        )}

        {step === 2 && (
            user ? (
                <CheckoutAddressForm
                    user={user}
                    onSubmit={handleAddressSubmit}
                    loading={updateLoading}
                />
            ) : (
                <CheckoutForm
                    onSubmit={handleRegister}
                    loading={registerLoading}
                />
            )
        )}

        {step === 3 && <PaymentStep onCheckout={handleCheckout} />}
      </Stack>
  );
};

export default Cart