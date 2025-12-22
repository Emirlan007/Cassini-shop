import {Box, Step, StepLabel, Chip, Stepper, Typography} from "@mui/material";
import {DeliveryStatus} from "../../../constants";
import {useTranslation} from "react-i18next";
import type {Order, OrderItemAdmin} from "../../../types";
import {useAppSelector} from "../../../app/hooks";
import {selectUser} from "../../users/usersSlice";
import theme from "../../../theme";
import OrderProduct from "./OrderProduct";
import {
    getDeliveryStatusColor,
    getDeliveryStatusText,
    getPaymentStatusColor,
    getPaymentStatusText,
} from "../../../utils/statusUtils";
import OrderCardComments from "./OrderCardComments";
import {useNavigate} from "react-router-dom";

interface Props {
    order: Order | OrderItemAdmin;
    isAdmin: boolean;
}

const OrderCard = ({order, isAdmin}: Props) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const {t} = useTranslation();

    const steps = Object.values(DeliveryStatus);

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
            onClick={() => navigate(`/orders/${order._id}`)}
        >
            <Box
                display="flex"
                flexDirection={{xs: "column", sm: "row"}}
                justifyContent="space-between"
                alignItems={{sm: "center"}}
                mb={1}
                gap={1}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        order: {xs: 1, sm: 2},
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

                <Box>
                    <Typography variant="subtitle2" sx={{order: {xs: 2, sm: 3}}}>
                        {t("createdAt")}: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            {order.items.map((item, index) => (
                <OrderProduct
                    key={`${order._id}-${item.product}-${item.selectedColor}-${item.selectedSize}-${index}`}
                    product={item}
                />
            ))}

            {!isAdmin && (
                <Box
                    sx={{
                        width: "100%",
                        background: theme.palette.secondary.main,
                        py: "1rem",
                        borderRadius: "10%",
                    }}
                >
                    <Stepper
                        activeStep={
                            Object.values(DeliveryStatus).indexOf(order.deliveryStatus) + 1
                        }
                        alternativeLabel
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel
                                    sx={{
                                        "& .MuiStepLabel-label": {
                                            color: "white !important",
                                        },
                                        "& .MuiStepIcon-root": {
                                            color: "white",
                                        },
                                        "& .MuiStepIcon-text": {
                                            fill: theme.palette.secondary.main,
                                        },
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            )}

            <OrderCardComments
                userComment={order.userComment}
                adminComments={user?.role === "admin" ? order.adminComments : undefined}
            />
        </Box>
    );
};

export default OrderCard;