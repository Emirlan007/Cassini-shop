import { type ChangeEvent } from "react";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { ICategory } from "../../../types";

interface ProductFormFieldsProps {
  name: string;
  description?: string;
  price: number;
  material?: string;
  inStock: boolean;
  isPopular?: boolean;
  category: string;
  categories: ICategory[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

const ProductFormFields = ({
  name,
  description,
  price,
  material,
  inStock,
  isPopular,
  category,
  categories,
  onInputChange,
  onCheckboxChange,
}: ProductFormFieldsProps) => {
  return (
    <Stack spacing={2}>
      <TextField
        label="Название товара"
        name="name"
        value={name}
        onChange={onInputChange}
      />
      <TextField
        label="Описание"
        name="description"
        value={description || ""}
        onChange={onInputChange}
      />
      <TextField
        label="Цена"
        name="price"
        type="number"
        value={price}
        onChange={onInputChange}
      />
      <TextField
        label="Материал (опционально)"
        name="material"
        value={material || ""}
        onChange={onInputChange}
      />

      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStock}
              onChange={(e) => onCheckboxChange("inStock", e.target.checked)}
            />
          }
          label="В наличии"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPopular || false}
              onChange={(e) => onCheckboxChange("isPopular", e.target.checked)}
            />
          }
          label="Популярное"
        />
      </Stack>

      <TextField
        select
        label="Категория"
        name="category"
        value={category}
        onChange={onInputChange}
      >
        <MenuItem value="" disabled>
          Please select a category
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.title}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default ProductFormFields;
