import { type ChangeEvent, useState } from "react";
import type { ProductInput } from "../../../types";

export const useProductForm = (initialState: ProductInput) => {
  const [state, setState] = useState<ProductInput>(initialState);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setState((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSizeUpdate = (value: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      size: checked
        ? [...prev.size, value]
        : prev.size.filter((s) => s !== value),
    }));
  };

  const handleColorsUpdate = (value: string, checked: boolean) => {
    setState((prev) => {
      const updatedImagesByColor = { ...prev.imagesByColor };
      if (!checked) delete updatedImagesByColor[value];

      return {
        ...prev,
        colors: checked
          ? [...prev.colors, value]
          : prev.colors.filter((c) => c !== value),
        imagesByColor: updatedImagesByColor,
      };
    });
  };

  const toggleImageColor = (color: string, index: number, checked: boolean) => {
    setState((prev) => {
      const prevImages = prev.imagesByColor?.[color] || [];
      return {
        ...prev,
        imagesByColor: {
          ...prev.imagesByColor,
          [color]: checked
            ? [...prevImages, index]
            : prevImages.filter((i) => i !== index),
        },
      };
    });
  };

  return {
    state,
    setState,
    inputChangeHandler,
    handleCheckboxChange,
    handleSizeUpdate,
    handleColorsUpdate,
    toggleImageColor,
  };
};
