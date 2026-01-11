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
import { type ChangeEvent, type FormEvent, useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { API_URL } from "../../../constants";

interface Props {
  onSubmit: (product: ProductInput) => Promise<void>;
  loading: boolean;
  existingProduct?: ProductInput;
}

const ProductForm = ({ onSubmit, loading, existingProduct }: Props) => {
  const [isSizesOpen, setSizesOpen] = useState(false);
  const [isColorsOpen, setColorsOpen] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectFetchingCategories);

  const MAX_IMAGES = 10;

  const initialState: ProductInput = useMemo(() => ({
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
  }), []);

  const [state, setState] = useState<ProductInput>(initialState);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (existingProduct) {
      setState(existingProduct);
    } else {
      setState(initialState);
    }
  }, [id, existingProduct, initialState]);

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

  const translatedChangeHandler = useCallback(
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
          }, []);

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

  const TranslateField = ({
                            field,
                            lang,
                            label
                          }: {
    field: "name" | "description" | "material";
    lang: "ru" | "en" | "kg";
    label: string;
  }) => {
    const isEnglish = lang === "en";

    return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
              fullWidth={!isEnglish}
              label={label}
              value={state[field][lang]}
              onChange={translatedChangeHandler(field, lang)}
              required={field === "name" && lang === "ru"}
              sx={{ ...fieldSx, flexGrow: isEnglish ? 1 : undefined }}
          />
          {isEnglish && (
              <Button
                  variant="contained"
                  onClick={() => translateFieldToEn(field)}
                  disabled={!state[field].ru}
                  sx={{ minWidth: 48, height: 56 }}
              >
                {translating ? <CircularProgress size={20} /> : "Перевести"}
              </Button>
          )}
        </Stack>
    );
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
          {existingProduct ? "Редактировать товар" : "Новый товар"}
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

            <Typography fontWeight={600}>Название</Typography>
            <TranslateField field="name" lang="ru" label="Название (RU)" />
            <TranslateField field="name" lang="en" label="Название (EN)" />
            <TranslateField field="name" lang="kg" label="Название (KG)" />

            <Typography fontWeight={600}>Описание</Typography>
            <TranslateField field="description" lang="ru" label="Описание (RU)" />
            <TranslateField field="description" lang="en" label="Описание (EN)" />
            <TranslateField field="description" lang="kg" label="Описание (KG)" />

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
            <TranslateField field="material" lang="ru" label="Материал (RU)" />
            <TranslateField field="material" lang="en" label="Материал (EN)" />
            <TranslateField field="material" lang="kg" label="Материал (KG)" />

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
                              alt={`Изображение товара ${index + 1}`}
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
              {existingProduct ? "Обновить товар" : "Создать товар"}
            </Button>
          </Stack>
        </Box>
      </Box>
  );
};

export default ProductForm;