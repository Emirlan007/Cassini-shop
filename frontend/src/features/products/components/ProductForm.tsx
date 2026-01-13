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

import type { ICategory, ProductInput } from "../../../types";
import { findClosestColor } from "../../../utils/colorNormalizer";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../../constants";

interface Props {
  onSubmit: (product: ProductInput) => Promise<void>;
  loading: boolean;
  productData?: ProductInput & { category: ICategory };
}

const ProductForm = ({ onSubmit, loading, productData }: Props) => {
  const [isSizesOpen, setSizesOpen] = useState(false);
  const [isColorsOpen, setColorsOpen] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectFetchingCategories);

  const MAX_IMAGES = 10;

  const [state, setState] = useState<ProductInput>({
    name: { ru: "", en: "", kg: "" },
    description: { ru: "", en: "", kg: "" },
    category: "",
    size: [],
    colors: [],
    price: 0,
    images: [],
    imagesByColor: {},
    video: null,
    inStock: true,
    material: { ru: "", en: "", kg: "" },
    isPopular: false,
  });

  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!productData) return;

    const { category, ...rest } = productData;

    setState({
      ...rest,
      category: category._id,
    });
  }, [productData]);

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
      [name]: name === "price" ? Number(value) : value,
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

  const translatedChangeHandler =
    (field: "name" | "description" | "material", lang: "ru" | "en" | "kg") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    };

  const translateFieldToEn = async (
    field: "name" | "description" | "material"
  ) => {
    const text = state[field].ru.trim();
    if (!text) return;

    try {
      setTranslating(true);

      const res = await fetch(`${API_URL}translation/translate/en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Translate EN failed");
      }

      const data: { translation: string } = await res.json();

      setState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          en: data.translation,
        },
      }));
    } finally {
      setTranslating(false);
    }
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
        mt: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        px: 2,
      }}
    >
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

          <Typography fontWeight={600}>Название</Typography>

          <TextField
            fullWidth
            label="Название (RU)"
            value={state.name.ru}
            onChange={translatedChangeHandler("name", "ru")}
            required
            sx={fieldSx}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Название (EN)"
              value={state.name.en}
              onChange={translatedChangeHandler("name", "en")}
              sx={{ ...fieldSx, flexGrow: 1 }}
            />

            <Button
              variant="contained"
              onClick={() => translateFieldToEn("name")}
              disabled={!state.name.ru}
              loading={translating}
              sx={{ minWidth: 48, height: 56 }}
            >
              Перевести
            </Button>
          </Stack>

          <TextField
            label="Название (KG)"
            value={state.name.kg}
            onChange={translatedChangeHandler("name", "kg")}
            sx={fieldSx}
          />

          <Typography fontWeight={600}>Описание</Typography>

          <TextField
            fullWidth
            label="Описание (RU)"
            value={state.description.ru}
            onChange={translatedChangeHandler("description", "ru")}
            sx={fieldSx}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Описание (EN)"
              value={state.description.en}
              onChange={translatedChangeHandler("description", "en")}
              sx={{ ...fieldSx, flexGrow: 1 }}
            />

            <Button
              variant="contained"
              onClick={() => translateFieldToEn("description")}
              disabled={!state.description.ru}
              loading={translating}
              sx={{ minWidth: 48, height: 56 }}
            >
              Перевести
            </Button>
          </Stack>

          <TextField
            label="Описание (KG)"
            value={state.description.kg}
            onChange={translatedChangeHandler("description", "kg")}
            sx={fieldSx}
          />

          <TextField
            type="number"
            label="Цена"
            name="price"
            value={state.price}
            onChange={inputChangeHandler}
            required
            sx={fieldSx}
          />

          <Typography fontWeight={600}>Материал</Typography>

          <TextField
            fullWidth
            label="Материал (RU)"
            value={state.material.ru}
            onChange={translatedChangeHandler("material", "ru")}
            sx={fieldSx}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="Материал (EN)"
              value={state.material.en}
              onChange={translatedChangeHandler("material", "en")}
              sx={{ ...fieldSx, flexGrow: 1 }}
            />

            <Button
              variant="contained"
              onClick={() => translateFieldToEn("material")}
              disabled={!state.material.ru}
              loading={translating}
              sx={{ minWidth: 48, height: 56 }}
            >
              Перевести
            </Button>
          </Stack>

          <TextField
            label="Материал (KG)"
            value={state.material.kg}
            onChange={translatedChangeHandler("material", "kg")}
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
            <ImageList cols={10} rowHeight={164}>
              {state.images.map((image, index) => (
                <Stack key={index}>
                  <ImageListItem>
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format`
                      }
                      srcSet={
                        image instanceof File
                          ? undefined
                          : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                      }
                    />
                  </ImageListItem>
                  <Button
                    onClick={() => removeImageHandler(image)}
                    color="error"
                    variant="contained"
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
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      key={color}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
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
                  </Stack>
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
            Сохранить
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductForm;
