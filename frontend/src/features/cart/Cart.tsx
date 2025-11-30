import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {removeFromCart, selectItems, updateQuantity} from "./cartSlice.ts";
import {Box, Button, IconButton, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import {API_URL} from "../../constants.ts";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import CheckoutForm from "./components/CheckoutForm.tsx";
import PaymentStep from "./components/PaymentStep.tsx";
import Stepper from "./components/Stepper.tsx";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectItems);
    const { t } = useTranslation();

    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [formData, setFormData] = useState<null | {
        name: string;
        number: string;
        city: string;
        address: string;
        comment?: string;
    }>(null);


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

            <Stepper step={step} />

            {step === 1 && (
                <>
                    {items.map(item => (
                        <Box
                            key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                            p={1}
                            border="1px solid #ccc"
                            borderRadius={2}
                            gap={1}
                        >
                            <img
                                src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                                alt={item.title}
                                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 8 }}
                            />
                            <Box flex={1}>
                                <Typography fontWeight="bold" sx={{ xs: 'h6', sm: 'body1' }}>{item.title}</Typography>
                                <Typography variant="body2">{t("color")}: {item.selectedColor}</Typography>
                                <Typography variant="body2">{t("size")}: {item.selectedSize}</Typography>
                                <Typography variant="body2">{t("price")}: {item.price}₸</Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    size="small"
                                    sx={{ color: 'red', fontSize: 30, height: '30px' }}
                                    onClick={() =>
                                        dispatch(updateQuantity({ ...item, quantity: item.quantity - 1 }))
                                    }
                                >
                                    -
                                </Button>
                                <Typography>{item.quantity}</Typography>
                                <Button
                                    size="small"
                                    sx={{ color: 'red', fontSize: 20, height: '30px' }}
                                    onClick={() =>
                                        dispatch(updateQuantity({ ...item, quantity: item.quantity + 1 }))
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
                    <Button variant="contained" onClick={() => setStep(2)}>Далее</Button>
                </>
            )}

            {step === 2 && (
                <CheckoutForm onSubmit={(data) => {
                    setFormData(data);
                    setStep(3);
                }} />
            )}

            {step === 3 && formData && (
                <PaymentStep />
            )}
        </Stack>
    );
};

export default Cart;