import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { clearCart, selectCart } from "./cartSlice.ts";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
// import { useTranslation } from "react-i18next";
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
import CartItemsList from "./components/CartItemsList.tsx";
import StepBackButton from "./../../components/UI/StepBackButton.tsx";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCart)?.items ?? [];
    const user = useAppSelector(selectUser);
    const totalPrice = useAppSelector(selectCart)?.totalPrice ?? 0;
    const registerLoading = useAppSelector(selectRegisterLoading);
    const updateLoading = useAppSelector(selectUpdateAddressLoading);
    // const { t } = useTranslation();

    const [step, setStep] = useState<1 | 2 | 3>(1);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
        await dispatch(updateItemQuantity({ ...item, quantity: newQuantity }));
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
                <CartItemsList
                    items={items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onNext={() => setStep(2)}
                />
            )}

            {step === 2 && (
                <Box>
                    <StepBackButton onBack={() => setStep(1)} />
                    {user ? (
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
                    )}
                </Box>
            )}

            {step === 3 && (
                <Box>
                    <StepBackButton onBack={() => setStep(2)} />
                    <PaymentStep onCheckout={handleCheckout} />
                </Box>
            )}
        </Stack>
    );
};

export default Cart;