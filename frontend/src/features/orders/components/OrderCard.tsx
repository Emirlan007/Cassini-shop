import {
    Box,
    Stack,
    Chip,
    Typography,
} from "@mui/material";
import { API_URL, DeliveryStatus } from "../../../constants";
import { useTranslation } from "react-i18next";
import type { Order, OrderItemAdmin } from "../../../types";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../users/usersSlice";

interface Props {
    order: Order;
    onClick?: () => void;
}

const OrderCard = ({ order, onClick }: Props) => {
    const user = useAppSelector(selectUser);
    const { t } = useTranslation();

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "success";
            case "cancelled":
                return "error";
            case "pending":
            default:
                return "warning";
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case "paid":
                return "Оплачен";
            case "cancelled":
                return "Отменен";
            case "pending":
            default:
                return "Ожидает оплаты";
        }
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case DeliveryStatus.Delivered:
                return "success";
            case DeliveryStatus.OnTheWay:
                return "warning";
            case DeliveryStatus.Warehouse:
                return "error";
            default:
                return "default";
        }
    };

    const getDeliveryStatusText = (status: string) => {
        switch (status) {
            case DeliveryStatus.Warehouse:
                return "На складе";
            case DeliveryStatus.OnTheWay:
                return "В пути";
            case DeliveryStatus.Delivered:
                return "Доставлен";
            default:
                return status;
        }
    };

    return (
        <Box
            key={order._id}
            mb={3}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                },
            }}
            onClick={onClick}
        >
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                mb={1}
                gap={1}
            >
                <Typography variant="subtitle2" sx={{ order: { xs: 3, sm: 1 } }}>
                    {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        order: { xs: 1, sm: 2 },
                    }}
                >
                    <Chip
                        label={getDeliveryStatusText(order.deliveryStatus)}
                        color={getDeliveryStatusColor(order.deliveryStatus)}
                        size="small"
                    />
                    <Chip
                        label={getPaymentStatusText(order.paymentStatus)}
                        color={getPaymentStatusColor(order.paymentStatus)}
                        size="small"
                    />
                </Box>
            </Box>

            {order.items.map((item, index) => (
                <Box
                    key={`${order._id}-${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={2}
                >
                    {item.image && (
                        <img
                            src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                            alt={item.title || "Product"}
                            style={{
                                width: 160,
                                height: 160,
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                        }}
                    >
                        <Typography>{item.title}</Typography>

                        <Box component="div" sx={{display:"flex", gap:1, alignItems:"center"}}>
                            <Typography variant="body2"><strong>{t("color")}:</strong></Typography>
                            <Box
                                component="div"
                                sx={{
                                    background: `${item.selectedColor}`,
                                    height: "1rem",
                                    width: "1rem",
                                    borderRadius: "50%",
                                    display: "",
                                }}
                            />
                        </Box>

                        <Typography variant="body2">
                            <strong>{t("size")}</strong>: {item.selectedSize}
                        </Typography>
                        <Typography variant="body2">
                            <strong>{t("price")}</strong>: {item.price} сом
                        </Typography>
                        <Typography variant="body2">
                            <strong>{t("quantity")}</strong>: {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                            <strong>{t("total")}</strong>: {item.price * item.quantity} сом
                        </Typography>
                    </Box>
                </Box>
            ))}

            {order.userComment && order.userComment.trim() !== "" && (
                <Stack>
                    <Typography variant="body1">Комментарий</Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            background: "#dddddd",
                            borderRadius: 1,
                            p: 0.5,
                        }}
                    >
                        {order.userComment}
                    </Typography>
                </Stack>
            )}

            {user?.role === "admin" && order.adminComments.length > 0 && (
                <Stack>
                    <Typography variant="body1">Комментарии админа</Typography>
                    {order.adminComments.map((comment) => (
                        <Typography
                            variant="body2"
                            key={comment}
                            sx={{
                                background: "#dddddd",
                                borderRadius: 1,
                                p: 1,
                                mb: 1,
                            }}
                        >
                            {comment}
                        </Typography>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default OrderCard;