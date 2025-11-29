import { Box, Typography } from "@mui/material";
import { API_URL } from "../../../constants";
import { useTranslation } from "react-i18next";
import type {Order} from "../../../types";

interface Props {
    order: Order;
    onClick?: () => void;
}

const OrderCard = ({ order, onClick }: Props) => {
    const { t } = useTranslation();

    return (
        <Box
            key={order._id}
            mb={3} p={2}
            border="1px solid #ccc"
            borderRadius={2}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                }
            }}
            onClick={onClick}
        >
            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                mb={1}
                gap={0.5}
            >
                <Typography variant="subtitle2">
                    {t("orderNumber")}{order._id}
                </Typography>

                <Typography variant="subtitle2">
                    {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
                </Typography>
            </Box>

            {order.items.map((item, index) => (
                <Box
                    key={`${order._id}-${item.productId}-${item.selectedColor}-${item.selectedSize}-${index}`}
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={2}
                    mb={1}
                >
                    {item.image && (
                        <img
                            src={`${API_URL}/${item.image.replace(/^\/+/, "")}`}
                            alt={item.title || "Product"}
                            style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 8 }}
                        />
                    )}
                    <Box>
                        <Typography>{item.title}</Typography>
                        <Typography variant="body2">{t("color")}: {item.selectedColor}</Typography>
                        <Typography variant="body2">{t("size")}: {item.selectedSize}</Typography>
                        <Typography variant="body2">{t("price")}: {item.price}₸</Typography>
                        <Typography variant="body2">{t("quantity")}: {item.quantity}</Typography>
                        <Typography variant="body2">{t("total")}: {item.price * item.quantity}₸</Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default OrderCard;