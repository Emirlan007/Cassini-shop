import {
  Button,
  CircularProgress,
  Divider,
  ImageList,
  ImageListItem,
  MenuItem,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import type { ProductInput } from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import {
  selectCategories,
  selectFetchingCategories,
} from "../../categories/categorySlice.ts";
import { fetchCategories } from "../../categories/categoryThunk.ts";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (product: ProductInput) => Promise<void>;
  loading: boolean;
}

const ProductForm = ({ onSubmit, loading }: Props) => {
  const [isSizesOpen, setSizesOpen] = useState(false);
  const [isColorsOpen, setColorsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectFetchingCategories);
  const { t } = useTranslation();

  const MAX_IMAGES = 10;

  const [state, setState] = useState<ProductInput>({
    name: "",
    description: "",
    category: "",
    size: [],
    colors: [],
    price: 0,
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

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const imagesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    setState((prev) => {
      const total = prev.images.length + newFiles.length;
      if (total > MAX_IMAGES) {
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
          Object.entries(prev.imagesByColor).map(([color, indexes]) => [
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
      if (!checked) {
        delete updatedImagesByColor[value];
      }

      return {
        ...prev,
        colors: checked
            ? [...prev.colors, value]
            : prev.colors.filter((c) => c !== value),
        imagesByColor: updatedImagesByColor,
      };
    });
  };

  const toggleImageColor = (
      color: string,
      imageIndex: number,
      checked: boolean
  ) => {
    setState((prev) => {
      const prevImages = prev.imagesByColor[color] || [];
      const updatedImages = checked
          ? [...prevImages, imageIndex]
          : prevImages.filter((i) => i !== imageIndex);

      return {
        ...prev,
        imagesByColor: {
          ...prev.imagesByColor,
          [color]: updatedImages,
        },
      };
    });
  };

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.size.length) {
      alert("Выберите хотя бы один размер");
      return;
    }

    if (!state.colors.length) {
      alert("Выберите хотя бы один цвет");
      return;
    }

    await onSubmit(state);
    navigate("/admin/products");
  };

  return (
      <Stack spacing={2} component="form" onSubmit={submitFormHandler}>
        <TextField
            select
            label={t("productForm.category")}
            value={state.category}
            onChange={(e) =>
                setState((prev) => ({ ...prev, category: e.target.value }))
            }
            required
        >
          <MenuItem value="" disabled>
            Please select a category
          </MenuItem>

          {categoriesLoading && <CircularProgress size={20} />}

          {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.title}
              </MenuItem>
          ))}
        </TextField>

        <TextField
            label={t("productForm.name")}
            name="name"
            value={state.name}
            onChange={inputChangeHandler}
            required
        />

        <TextField
            multiline
            minRows={3}
            label={t("productForm.description")}
            name="description"
            value={state.description}
            onChange={inputChangeHandler}
            required
        />

        <TextField
            type="number"
            label={t("productForm.price")}
            name="price"
            value={state.price}
            onChange={inputChangeHandler}
            required
        />

        <TextField
            label="Материал"
            name="material"
            value={state.material}
            onChange={inputChangeHandler}
        />

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

        <SizesModal
            open={isSizesOpen}
            onClose={() => setSizesOpen(false)}
            sizes={state.size}
            onChange={handleSizeChange}
        />

        <Button variant="contained" onClick={() => setSizesOpen(true)}>
          {t("productForm.sizes")}
        </Button>

        <ColorsModal
            open={isColorsOpen}
            onClose={() => setColorsOpen(false)}
            colors={state.colors}
            onChange={handleColorsChange}
        />

        <Button variant="contained" onClick={() => setColorsOpen(true)}>
          {t("productForm.colors")}
        </Button>

        <FileInput
            label={t("productForm.images")}
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
                        color="error"
                        onClick={() => removeImageHandler(image)}
                    >
                      {t("remove")}
                    </Button>
                  </Stack>
              ))}
            </ImageList>
        )}

        {state.images.length > 0 && state.colors.length > 0 && (
            <>
              <Divider />
              <strong>Привязка изображений к цветам</strong>

              {state.colors.map((color) => (
                  <Stack key={color}>
                    <strong>{color}</strong>

                    <Stack direction="row" flexWrap="wrap">
                      {state.images.map((_, index) => (
                          <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                    checked={
                                        state.imagesByColor[color]?.includes(index) || false
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

        <FileInput
            label={t("productForm.video")}
            name="video"
            onChange={videoChangeHandler}
        />

        <Divider />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? t("productForm.creating") : t("productForm.create")}
        </Button>
      </Stack>
  );
};

export default ProductForm;
