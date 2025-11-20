import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {removeFromCart, selectItems, selectTotalPrice, updateQuantity} from "./cartSlice.ts";
import {Box, Button, IconButton, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import {API_URL} from "../../constants.ts";


const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectItems);
    const totalPrice = useAppSelector(selectTotalPrice);

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
                <Typography variant="h4" fontWeight="bold">Корзина пуста</Typography>
                <Typography variant="body1">Добавьте товары, чтобы сделать заказ</Typography>
                <Button variant="contained" onClick={() => navigate("/")}>Начать покупки</Button>
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
                        <Typography variant="body2">Цвет: {item.selectedColor}</Typography>
                        <Typography variant="body2">Размер: {item.selectedSize}</Typography>
                        <Typography variant="body2">Цена: {item.price}₸</Typography>
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

            <Box display="flex"
                 flexDirection={{xs: "column", sm: "row"}}
                 justifyContent="space-between"
                 alignItems={{ xs: "center", sm: "center" }}
                 gap={{ xs: 2, sm: 0 }}
                 mt={2}

            >
                <Typography variant="h6" textAlign={{ xs: "center", sm: "left" }}>
                    Итого: {totalPrice}₸
                </Typography>
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={2}
                    width={{ xs: "100%", sm: "auto" }}
                    mt={{ xs: 2, sm: 0 }}
                >
                    <Button variant="contained" onClick={() => navigate("/register")}>Оформить заказ</Button>
                    <Button variant="contained" onClick={() => navigate("/")}>Продолжить покупки</Button>
                </Box>
            </Box>
        </Stack>
    );
};

export default Cart;