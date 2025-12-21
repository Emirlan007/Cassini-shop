import { type ChangeEvent } from "react";
import {
  Stack,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { ICategory } from "../../../types";

interface Props {
  name: string;
  description?: string;
  price: number;
  material?: string;
  inStock?: boolean;
  isPopular?: boolean;
  category: string | null;
  categories: ICategory[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#660033",
    },
    "&:hover fieldset": {
      borderColor: "#F0544F",
    },
    "&:active fieldset": {
      borderColor: "#F0544F",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#660033",
  },
};

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
}: Props) => {
  return (
    <Stack spacing={2}>
      <TextField
        required
        fullWidth
        label="Название товара"
        name="name"
        value={name}
        onChange={onInputChange}
        autoComplete="name"
        sx={textFieldStyles}
      />

      <TextField
        required
        fullWidth
        type="description"
        label="Описание"
        name="description"
        value={description}
        onChange={onInputChange}
        autoComplete="new-description"
        sx={textFieldStyles}
      />

      <TextField
        required
        fullWidth
        type="price"
        label="Цена"
        name="price"
        value={price}
        onChange={onInputChange}
        sx={textFieldStyles}
      />

      <TextField
        id="material"
        label="Материал (опционально)"
        name="material"
        value={material}
        onChange={onInputChange}
        fullWidth
        sx={textFieldStyles}
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
              checked={isPopular}
              onChange={(e) => onCheckboxChange("isPopular", e.target.checked)}
            />
          }
          label="Популярное"
        />
      </Stack>

      <TextField
        select
        id="category"
        label="Категория"
        name="category"
        value={category ?? ""}
        onChange={onInputChange}
        required
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
