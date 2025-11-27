import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrderDetails, selectOrderDetailsLoading,} from "./ordersSlice";
import { useEffect } from "react";
import { fetchOrderById } from "./ordersThunk";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import { API_URL } from "../../constants";
import { useTranslation } from "react-i18next";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {selectUser} from "../users/usersSlice.ts";

const OrderDetails = () => {
    const dispatch = useAppDispatch();
    const order = useAppSelector(selectOrderDetails);
    const loading = useAppSelector(selectOrderDetailsLoading);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useAppSelector(selectUser);

    const { orderId } = useParams() as { orderId: string };

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
        }
    }, [dispatch, orderId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    if (!order) {
        return (
            <Typography textAlign="center" mt={2}>
                {t("orderNotFound")}
            </Typography>
        );
    }

    return (
        <Box>
            <Button
                startIcon={<NavigateBeforeIcon />}
                onClick={() => navigate("/account")}
                sx={{ mb: 3 }}
                variant="contained"
            >
                {t("backToOrders")}
            </Button>

            <Box
                mb={4}
                p={3}
            >
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    mb={3}
                >
                    <Typography variant="h6" fontWeight="bold">
                        {t("orderNumber")}{order._id}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                </Box>

                {user.role === "admin" && order.user && (
                    <Box
                        mb={3}
                        p={2}
                        border="1px solid #ccc"
                        borderRadius={2}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {t("customerInfo")}
                        </Typography>

                        <Typography variant="body1">
                            <b>{t("displayName")}:</b> {order.user.displayName}
                        </Typography>

                        <Typography variant="body1">
                            <b>{t("phoneNumber")}:</b> {order.user.phoneNumber}
                        </Typography>
                    </Box>
                )}

                {order.items.map((item) => (
                    <Box
                        key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        mb={3}
                        p={2}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            flexDirection="column"
                            sx={{
                                height: {xs: 320, sm: 400},
                                width: '100%',
                                overflow: 'hidden',
                                borderRadius: 2,
                            }}
                        >
                            <img
                                src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                                alt={item.title}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: 8,
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    width: 'auto',
                                    height: 'auto'
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ mb: 1, mt: 2}}>
                                <b>{item.title}</b>
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {t("color")}: {item.selectedColor}
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {t("size")}: {item.selectedSize}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {t("price")}: {item.price}₸
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {t("quantity")}: {item.quantity}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    pt={2}
                    borderTop="1px solid #e0e0e0"
                >
                    <Typography variant="h6">
                        {t("total")}:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {order.totalPrice}₸
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderDetails;