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
    const statusMap: Record<string, string> = {
        warehouse: "На складе",
        in_transit: "В пути",
        delivered: "Доставлен",
    };
    return statusMap[status] || status;
};