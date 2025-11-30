import {Box, Button, Paper, Stack, Typography, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {clearCart, selectItems, selectTotalPrice} from "../cartSlice.ts";
import {createOrder} from "../../orders/ordersThunk.ts";
import toast from "react-hot-toast";


const PaymentStep = () => {
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "qrCode">("cash");

    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectItems)
    const totalPrice = useAppSelector(selectTotalPrice);

    const handleCheckout = async () => {

        const orderItems = items.map(item => ({
            product: item.productId,
            title: item.title,
            image: item.image,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            price: item.price,
            quantity: item.quantity,
        }));

        const orderData = {
            items: orderItems,
            totalPrice,
            paymentMethod,
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

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Итого: {totalPrice}₸
                    </Typography>

                    <Button variant="contained" onClick={handleCheckout}>
                        Оформить заказ
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
};

export default PaymentStep;