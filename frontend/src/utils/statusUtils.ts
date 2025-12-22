export const getPaymentStatusColor = (status: string): 'success' | 'error' | 'warning' => {
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

export const getPaymentStatusText = (status: string): string => {
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

export const getDeliveryStatusText = (status: string): string => {
    switch (status) {
        case "warehouse":
            return "На складе";
        case "on_the_way":
            return "В пути";
        case "delivered":
            return "Доставлен";
        default:
            return "default";
    }
};

export const getDeliveryStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "success";
        case "on_the_way":
            return "warning";
        case "warehouse":
            return "error";
        default:
            return "default";
    }
};