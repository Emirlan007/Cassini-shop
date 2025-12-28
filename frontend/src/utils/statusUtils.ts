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

export const getOrderStatusText = (status: string): string => {
  switch (status) {
    case "pending":
      return "Ожидает обработки";
    case "completed":
      return "Завершен";
    case "canceled":
      return "Отменен";
    default:
      return status;
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "completed":
      return "success";
    case "canceled":
      return "error";
    default:
      return "default";
  }
};
