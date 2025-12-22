import { store } from "../app/store";
import { axiosApi } from "../axiosApi";
import { getSessionId } from "../utils/getSessionId";

export const trackProductView = async (productId: string) => {
  const userId = store.getState().users.user?._id;
  const payload = {
    type: "product_view",
    sessionId: getSessionId(),
    userId,
    productId,
  };
  await axiosApi.post("/analytics/event", payload);
};

export const addToCart = async (productId: string, qty: number = 1) => {
  const userId = store.getState().users.user?._id;
  const payload = {
    type: "add_to_cart",
    sessionId: getSessionId(),
    userId,
    productId,
    qty,
  };

  await axiosApi.post("/analytics/event", payload);
};
