import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ImageList,
  ImageListItem,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FileInput from "../../../components/UI/FileInput/FileInput";
import SizesModal from "../../../components/UI/SizesModal/SizesModal";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCategories,
  selectFetchingCategories,
} from "../../categories/categorySlice";
import { fetchCategories } from "../../categories/categoryThunk";

import type { ProductInput } from "../../../types";
import { findClosestColor } from "../../../utils/colorNormalizer";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (product: ProductInput) => Promise<void>;
  loading: boolean;
}

const ProductForm = ({ onSubmit, loading }: Props) => {
  const [isSizesOpen, setSizesOpen] = useState(false);
  const [isColorsOpen, setColorsOpen] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectFetchingCategories);

  const MAX_IMAGES = 10;

  const [state, setState] = useState<ProductInput>({
    name: "",
    description: "",
    category: "",
    size: [],
    colors: [],
    price: "" as unknown as number,
    images: [],
    imagesByColor: {},
    video: null,
    inStock: true,
    material: "",
    isPopular: false,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#660033" },
      "&:hover fieldset": { borderColor: "#F0544F" },
    },
    "& .MuiInputLabel-root": { color: "#660033" },
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || 0 : value,
    }));
  };

  const imagesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    setState((prev) => {
      if (prev.images.length + newFiles.length > MAX_IMAGES) {
        alert(`Максимум ${MAX_IMAGES} изображений`);
        return prev;
      }
      return { ...prev, images: [...prev.images, ...newFiles] };
    });
  };

  const removeImageHandler = (file: File) => {
    setState((prev) => {
      const removedIndex = prev.images.indexOf(file);

      const updatedImagesByColor = Object.fromEntries(
        Object.entries(prev.imagesByColor || {}).map(([color, indexes]) => [
          color,
          indexes
            .filter((i) => i !== removedIndex)
            .map((i) => (i > removedIndex ? i - 1 : i)),
        ])
      );

      return {
        ...prev,
        images: prev.images.filter((i) => i !== file),
        imagesByColor: updatedImagesByColor,
      };
    });
  };

  const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState((prev) => ({ ...prev, video: file }));
  };

  const handleSizeChange = (value: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      size: checked
        ? [...prev.size, value]
        : prev.size.filter((s) => s !== value),
    }));
  };

  const handleColorsChange = (value: string, checked: boolean) => {
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

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.size.length) return alert("Выберите размер");
    if (!state.colors.length) return alert("Выберите цвет");

    await onSubmit(state);
    navigate("/admin/products");
  };

  const getClothesColorName = (hex: string) => {
    const test = findClosestColor(hex);
    return t(`colors.${test}`);
  };

  return (
    <Box
      sx={{
        mt: { xs: 4, sm: 8 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        px: 2,
      }}
    >
      <Typography variant="h5" sx={{ color: "#660033", mb: 2 }}>
        Новый товар
      </Typography>

      <Box component="form" onSubmit={submitFormHandler} sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Категория"
            name="category"
            value={state.category}
            onChange={inputChangeHandler}
            required
            sx={fieldSx}
          >
            <MenuItem value="" disabled>
              Выберите категорию
            </MenuItem>
            {categoriesLoading && <CircularProgress size={20} />}
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Название"
            name="name"
            value={state.name}
            onChange={inputChangeHandler}
            required
            sx={fieldSx}
          />

          <TextField
            multiline
            minRows={3}
            label="Описание"
            name="description"
            value={state.description}
            onChange={inputChangeHandler}
            required
            sx={fieldSx}
          />

          <TextField
              type="number"
              label="Цена"
              name="price"
              value={state.price === 0 ? "" : state.price}
              onChange={inputChangeHandler}
              required
              sx={fieldSx}
              placeholder="Введите цену"
              slotProps={{
                htmlInput: {
                  min: 0.01,
                  step: 0.01
                }
              }}
          />

          <TextField
            label="Материал"
            name="material"
            value={state.material}
            onChange={inputChangeHandler}
            sx={fieldSx}
          />

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.inStock}
                  onChange={(e) =>
                    setState((p) => ({ ...p, inStock: e.target.checked }))
                  }
                />
              }
              label="В наличии"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.isPopular}
                  onChange={(e) =>
                    setState((p) => ({ ...p, isPopular: e.target.checked }))
                  }
                />
              }
              label="Популярное"
            />
          </Stack>

          <SizesModal
            open={isSizesOpen}
            onClose={() => setSizesOpen(false)}
            sizes={state.size}
            onChange={handleSizeChange}
          />

          <Stack direction="row" spacing={2} alignItems={"center"}>
            <TextField
              fullWidth
              label="Выбранные размеры"
              value={state.size.join(", ") || "Не выбраны"}
            />
            <Button variant="contained" onClick={() => setSizesOpen(true)}>
              Размеры
            </Button>
          </Stack>

          <ColorsModal
            open={isColorsOpen}
            onClose={() => setColorsOpen(false)}
            colors={state.colors}
            onChange={handleColorsChange}
          />

          <Stack direction="row" spacing={2} alignItems={"center"}>
            <Button variant="contained" onClick={() => setColorsOpen(true)}>
              Расцветки
            </Button>
            <Box component="div" sx={{ display: "flex", gap: 2 }}>
              {state.colors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: "2rem",
                      height: "2rem",
                      background: color,
                      borderRadius: "50%",
                    }}
                  ></Box>
                  <Typography>{getClothesColorName(color)}</Typography>
                </Box>
              ))}
            </Box>
          </Stack>

          <FileInput label="Видео" name="video" onChange={videoChangeHandler} />

          <FileInput
            label="Изображения"
            name="images"
            onChange={imagesChangeHandler}
          />

          {state.images.length > 0 && (
            <ImageList cols={5} rowHeight={140}>
              {state.images.map((image, index) => (
                <Stack key={index}>
                  <ImageListItem>
                    <img src={URL.createObjectURL(image)} />
                  </ImageListItem>
                  <Button
                    variant={"contained"}
                    color="error"
                    onClick={() => removeImageHandler(image)}
                  >
                    Удалить
                  </Button>
                </Stack>
              ))}
            </ImageList>
          )}

          {state.images.length > 0 && state.colors.length > 0 && (
            <>
              {state.colors.map((color) => (
                <Stack key={color}>
                  <Typography fontWeight={600}>{color}</Typography>
                  <Stack direction="row" flexWrap="wrap">
                    {state.images.map((_, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={
                              state.imagesByColor?.[color]?.includes(index) ||
                              false
                            }
                            onChange={(e) =>
                              toggleImageColor(color, index, e.target.checked)
                            }
                          />
                        }
                        label={`Изображение ${index + 1}`}
                      />
                    ))}
                  </Stack>
                </Stack>
              ))}
            </>
          )}

          <Button type="submit" variant="contained" disabled={loading}>
            Создать товар
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductForm;
