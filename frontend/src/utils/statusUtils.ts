export const getDeliveryStatusText = (status: string): string => {
  switch (status) {
    case "warehouse":
      return "На складе";
    case "on_the_way":
      return "В пути";
    case "delivered":
      return "Доставлен";
    default:
      return status;
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

export const getOrderStatusText = (status: string): string => {
  switch (status) {
    case "awaiting_payment":
      return "Ожидает оплаты";
    case "paid":
      return "Оплачен";
    case "canceled":
      return "Отменен";
    default:
      return status;
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "awaiting_payment":
      return "warning";
    case "paid":
      return "success";
    case "canceled":
      return "error";
    default:
      return "default";
  }
};