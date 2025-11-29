import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {clearCart, removeFromCart, selectItems, selectTotalPrice, updateQuantity} from "./cartSlice.ts";
import {Box, Button, IconButton, Stack, Typography, TextField, ToggleButton, ToggleButtonGroup, Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import {API_URL} from "../../constants.ts";
import toast from "react-hot-toast";
import {selectUser} from "../users/usersSlice.ts";
import {createOrder, fetchOrders} from "../orders/ordersThunk.ts";
import {useTranslation} from "react-i18next";
import type {OrderMutation} from "../../types";
import {useState} from "react";


const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectItems);
    const totalPrice = useAppSelector(selectTotalPrice);
    const user = useAppSelector(selectUser);
    const { t } = useTranslation();
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qrCode'>('cash');
    const [comment, setComment] = useState<string>('');

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

    const orderData: OrderMutation = {
      items: orderItems,
      totalPrice,
      paymentMethod,
      status: "pending",
      userComment: comment.trim() || undefined,
    };

    try {
        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success("Заказ успешно оформлен!");
        await dispatch(fetchOrders()).unwrap();
        navigate("/account");
    } catch (error) {
      console.error("Order creation error:", error);
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
                <Typography variant="h4" fontWeight="bold">{t("emptyCart")}</Typography>
                <Typography variant="body1">{t("addProductToStartShopping")}</Typography>
                <Button variant="contained" onClick={() => navigate("/")}>{t("startShopping")}</Button>
            </Box>
        );
    }

    return (
        <Stack spacing={2} p={2}>
            {items.map(item => (
                <Box
                    key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                    display="flex"
                    flexDirection={{xs: 'column', sm: 'row'}}
                    alignItems={{xs: 'flex-start', sm: 'center'}}
                    justifyContent="space-between"
                    p={1}
                    border="1px solid #ccc"
                    borderRadius={2}
                    gap={1}
                >
                    <img
                        src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                        alt={item.title}
                        style={{width: 160, height: 160, objectFit: "cover", borderRadius: 8}}
                    />
                    <Box flex={1}>
                        <Typography fontWeight="bold" sx={{xs: 'h6', sm: 'body1'}}>{item.title}</Typography>
                        <Typography variant="body2">{t("color")}: {item.selectedColor}</Typography>
                        <Typography variant="body2">{t("size")}: {item.selectedSize}</Typography>
                        <Typography variant="body2">{t("price")}: {item.price}₸</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        <Button
                            size="small"
                            sx={{color: 'red', fontSize: 30, height: '30px'}}
                            onClick={() =>
                                dispatch(updateQuantity({...item, quantity: item.quantity - 1}))
                            }
                        >
                            -
                        </Button>
                        <Typography>{item.quantity}</Typography>
                        <Button
                            size="small"
                            sx={{color: 'red', fontSize: 20, height: '30px'}}
                            onClick={() =>
                                dispatch(updateQuantity({...item, quantity: item.quantity + 1}))
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
                            <DeleteIcon/>
                        </IconButton>
                    </Box>

                </Box>
            ))}

            <Paper sx={{ p: 3, mt: 3 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h6" mb={2}>
                            Способ оплаты
                        </Typography>
                        <ToggleButtonGroup
                            value={paymentMethod}
                            exclusive
                            onChange={(_, value) => {
                                if (value !== null) {
                                    setPaymentMethod(value);
                                }
                            }}
                            aria-label="payment method"
                            fullWidth
                        >
                            <ToggleButton value="cash" aria-label="cash">
                                Наличные
                            </ToggleButton>
                            <ToggleButton value="qrCode" aria-label="qr code">
                                QR-код
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box>
                        <TextField
                            label="Комментарий к заказу (необязательно)"
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            placeholder="Добавьте комментарий к вашему заказу..."
                        />
                    </Box>

                    <Box display="flex"
                         flexDirection={{xs: "column", sm: "row"}}
                         justifyContent="space-between"
                         alignItems={{xs: "center", sm: "center"}}
                         gap={2}
                    >
                        <Typography variant="h6" textAlign={{xs: "center", sm: "left"}}>
                            {t("total")}: {totalPrice}₸
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection={{xs: "column", sm: "row"}}
                            gap={2}
                            width={{xs: "100%", sm: "auto"}}
                        >
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (!user) {
                                        navigate("/register");
                                    } else {
                                        void handleCheckout();
                                    }
                                }}
                                fullWidth={{xs: true, sm: false}}
                            >
                                {t("checkout")}
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate("/")}
                                fullWidth={{xs: true, sm: false}}
                            >
                                {t("continueShopping")}
                            </Button>
                        </Box>
                    </Box>
                </Stack>
            </Paper>
        </Stack>
    );
};

export default Cart;