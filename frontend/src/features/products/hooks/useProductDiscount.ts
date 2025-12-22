import { useEffect, useState } from "react";
import type { Product } from "../../../types";
import { convertSeconds } from "../../../utils/dateFormatter";

export const useProductDiscount = (product?: Product) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [hasActiveDiscount, setHasActiveDiscount] = useState(false);

  useEffect(() => {
    const checkDiscount = () => {
      if (!product?.discount || !product.discountUntil) {
        setHasActiveDiscount(false);
        setTimeLeft("");
        return;
      }

      const now = new Date();
      const until = new Date(product.discountUntil);

      if (until <= now) {
        setHasActiveDiscount(false);
        setTimeLeft("");
        return;
      }

      setHasActiveDiscount(true);
      const diff = until.getTime() - now.getTime();
      const { weeks, days, hours, minutes } = convertSeconds(diff);

      setTimeLeft(
        `${weeks || days ? days + weeks * 7 + " d" : ""} ${
          hours ? hours + " h" : ""
        } ${minutes ? minutes + " m" : ""}`
      );
    };

    checkDiscount();
    const interval = setInterval(checkDiscount, 60000);
    return () => clearInterval(interval);
  }, [product?.discount, product?.discountUntil]);

  const finalPrice =
    product?.discount && hasActiveDiscount
      ? Math.round(product.price * (1 - product.discount / 100))
      : product?.price;

  return {
    hasActiveDiscount,
    timeLeft,
    finalPrice,
  };
};
