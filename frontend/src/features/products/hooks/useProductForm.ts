import { useState, type ChangeEvent } from "react";
import type { ProductInput } from "../../../types";

export const useProductForm = (initialState: ProductInput) => {
  const [state, setState] = useState<ProductInput>(initialState);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof ProductInput, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
    setState((prev) => ({
      ...prev,
      colors: checked
        ? [...prev.colors, value]
        : prev.colors.filter((c) => c !== value),
    }));
  };

  return {
    state,
    setState,
    inputChangeHandler,
    handleCheckboxChange,
    handleSizeUpdate,
    handleColorsUpdate,
  };
};
