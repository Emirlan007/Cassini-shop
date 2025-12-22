import type { ICategory, ProductInput } from "../../types";
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  ImageList,
  ImageListItem,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilesInput from "../../components/FilesInput/FilesInput.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectCategories } from "../categories/categorySlice.ts";
import { fetchCategories } from "../categories/categoryThunk.ts";
import SizesModal from "../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../components/UI/ColorsModal/ColorsModal.tsx";

interface Props {
  product: Omit<ProductInput, "category"> & {
    category: ICategory;
    material?: string;
    inStock?: boolean;
    isPopular?: boolean;
  };
  onSubmit(product: ProductInput): void;
}

const UpdateProduct: FC<Props> = ({ product, onSubmit }) => {
  const [isSizesOpen, setSizesOpen] = useState(false);
  const [isColorsOpen, setColorsOpen] = useState(false);

  const navigate = useNavigate();
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const [state, setState] = useState<ProductInput>({
    name: product.name,
    description: product.description,
    size: product.size,
    colors: product.colors,
    category: product.category?._id ?? "",
    images: product.images,
    imagesByColor: product.imagesByColor || {},
    video: product.video,
    price: product.price,
    material: product.material || "",
    inStock: product.inStock ?? true,
    isPopular: product.isPopular ?? false,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const MAX_IMAGES = 10;

  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    const newFiles = Array.from(files);

    setState((prev) => {
      // @ts-expect-error
      const existing = prev[name] || [];
      if (existing.length >= MAX_IMAGES) return prev;

      const availableSlots = MAX_IMAGES - existing.length;
      const filesToAdd = newFiles.slice(0, availableSlots);

      return {
        ...prev,
        [name]: [...existing, ...filesToAdd],
      };
    });
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
      const prevImages = prev.imagesByColor[color] || [];
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

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(state);
    navigate("/");
  };

  const removeImageHandler = (image: File | string) => {
    setState((prev) => {
      const removedIndex = prev.images.indexOf(image);

      const updatedImagesByColor = Object.fromEntries(
          Object.entries(prev.imagesByColor).map(([color, indexes]) => [
            color,
            indexes
                .filter((i) => i !== removedIndex)
                .map((i) => (i > removedIndex ? i - 1 : i)),
          ])
      );

      return {
        ...prev,
        images: prev.images.filter((i) => i !== image),
        imagesByColor: updatedImagesByColor,
      };
    });
  };

  const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState((prev) => ({
      ...prev,
      video: file,
    }));
  };

  return (
      <Box
          sx={{
            marginTop: { xs: 4, sm: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            px: 2,
          }}
      >
        <Typography component="h1" variant="h5" sx={{ color: "#660033" }}>
          Редактировать товар
        </Typography>

        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3, width: "100%" }}>
          <Stack spacing={2}>
            <TextField label="Название товара" name="name" value={state.name} onChange={inputChangeHandler} />
            <TextField label="Описание" name="description" value={state.description} onChange={inputChangeHandler} />
            <TextField label="Цена" name="price" type="number" value={state.price} onChange={inputChangeHandler} />
            <TextField label="Материал (опционально)" name="material" value={state.material} onChange={inputChangeHandler} />

            <Stack direction="row" spacing={2}>
              <FormControlLabel
                  control={
                    <Checkbox
                        checked={state.inStock}
                        onChange={(e) =>
                            setState((prev) => ({ ...prev, inStock: e.target.checked }))
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
                            setState((prev) => ({ ...prev, isPopular: e.target.checked }))
                        }
                    />
                  }
                  label="Популярное"
              />
            </Stack>

            <TextField
                select
                label="Категория"
                name="category"
                value={state.category}
                onChange={inputChangeHandler}
            >
              <MenuItem value="" disabled>
                Please select a category
              </MenuItem>
              {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title}
                  </MenuItem>
              ))}
            </TextField>

            <SizesModal
                open={isSizesOpen}
                onClose={() => setSizesOpen(false)}
                sizes={state.size}
                onChange={handleSizeUpdate}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                  sx={{ width: "100%" }}
                  label="Выбранные размеры"
                  value={state.size.length ? state.size.join(", ") : "No sizes selected"}
              />
              <Button variant="contained" onClick={() => setSizesOpen(true)}>
                Размеры
              </Button>
            </Stack>

            <ColorsModal
                open={isColorsOpen}
                onClose={() => setColorsOpen(false)}
                colors={state.colors}
                onChange={handleColorsUpdate}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                  sx={{ width: "100%" }}
                  label="Выбранные расцветки"
                  value={state.colors.join(", ")}
              />
              <Button variant="contained" onClick={() => setColorsOpen(true)}>
                Расцветки
              </Button>
            </Stack>

            <FilesInput label="Видео" name="video" onChange={videoChangeHandler} />
            <FilesInput label="Изображения" name="images" onChange={fileInputChangeHandler} />

            {state.images && (
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
                        <Typography fontWeight={600}>{color}</Typography>
                        <Stack direction="row" flexWrap="wrap">
                          {state.images.map((_, index) => (
                              <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                        checked={state.imagesByColor[color]?.includes(index) || false}
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

            <Button type="submit" fullWidth variant="contained">
              Редактировать
            </Button>
          </Stack>
        </Box>
      </Box>
  );
};

export default UpdateProduct;
