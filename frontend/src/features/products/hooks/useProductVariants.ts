import { useMemo, useState } from "react";
import type { Product } from "../../../types";

export const useProductVariants = (product?: Product) => {
  const [selectedColor, setSelectedColor] = useState<string | false>(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const images = useMemo(() => {
    if (!product?.images) return [];
    if (!selectedColor || !product.imagesByColor?.[selectedColor]) {
      return product.images;
    }

    return product.imagesByColor[selectedColor]
      .map((i) => product.images![i])
      .filter(Boolean);
  }, [product, selectedColor]);

  return {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    images,
    availableSizes: product?.size ?? [],
  };
};
