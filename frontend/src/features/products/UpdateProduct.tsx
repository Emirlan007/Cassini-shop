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
import FilesInput from "../../components/FilesInput/FilesInput";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCategories } from "../categories/categorySlice";
import { fetchCategories } from "../categories/categoryThunk";
import SizesModal from "../../components/UI/SizesModal/SizesModal";
import ColorsModal from "../../components/UI/ColorsModal/ColorsModal";

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
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const MAX_IMAGES = 10;

  const [state, setState] = useState<ProductInput>({
    name: product.name,
    description: product.description,
    size: product.size,
    colors: product.colors,
    category: product.category?._id ?? "",
    images: product.images,
    imagesByColor: product.imagesByColor || {}, // ✅ ДОБАВЛЕНО
    video: product.video,
    price: product.price,
    material: product.material || "",
    inStock: product.inStock ?? true,
    isPopular: product.isPopular ?? false,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    const newFiles = Array.from(files);

    setState((prev) => {
      // @ts-expect-error
      const existing = prev[name] || [];

      if (existing.length >= MAX_IMAGES) {
        alert(`Максимум ${MAX_IMAGES} изображений`);
        return prev;
      }

      return {
        ...prev,
        [name]: [...existing, ...newFiles.slice(0, MAX_IMAGES - existing.length)],
      };
    });
  };

  // ✅ СИНХРОНИЗАЦИЯ ПРИ УДАЛЕНИИ
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

  // ✅ ПРИВЯЗКА ИЗОБРАЖЕНИЯ К ЦВЕТУ
  const toggleImageColor = (
      color: string,
      index: number,
      checked: boolean
  ) => {
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

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(state);
    navigate("/");
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
        <Typography variant="h5">Редактировать товар</Typography>

        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3, width: "100%" }}>
          <Stack spacing={2}>
            <TextField label="Название" name="name" value={state.name} onChange={inputChangeHandler} />
            <TextField label="Описание" name="description" value={state.description} onChange={inputChangeHandler} multiline />
            <TextField type="number" label="Цена" name="price" value={state.price} onChange={inputChangeHandler} />

            <TextField label="Материал" name="material" value={state.material} onChange={inputChangeHandler} />

            <Stack direction="row">
              <FormControlLabel
                  control={<Checkbox checked={state.inStock} onChange={(e) => setState(p => ({ ...p, inStock: e.target.checked }))} />}
                  label="В наличии"
              />
              <FormControlLabel
                  control={<Checkbox checked={state.isPopular} onChange={(e) => setState(p => ({ ...p, isPopular: e.target.checked }))} />}
                  label="Популярное"
              />
            </Stack>

            <TextField select label="Категория" name="category" value={state.category} onChange={inputChangeHandler}>
              {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
              ))}
            </TextField>

            <SizesModal open={isSizesOpen} onClose={() => setSizesOpen(false)} sizes={state.size} onChange={(v, c) =>
                setState(p => ({ ...p, size: c ? [...p.size, v] : p.size.filter(s => s !== v) }))
            } />

            <ColorsModal open={isColorsOpen} onClose={() => setColorsOpen(false)} colors={state.colors} onChange={(v, c) =>
                setState(p => ({ ...p, colors: c ? [...p.colors, v] : p.colors.filter(col => col !== v) }))
            } />

            <FilesInput label="Видео" name="video" onChange={fileInputChangeHandler} />
            <FilesInput label="Изображения" name="images" onChange={fileInputChangeHandler} />

            {state.images.length > 0 && (
                <ImageList cols={10} rowHeight={164}>
                  {state.images.map((image, index) => (
                      <Stack key={index}>
                        <ImageListItem
                            sx={{
                              height: 140,
                              overflow: 'hidden',
                            }}
                        >
                          <img
                              src={
                                image instanceof File
                                    ? URL.createObjectURL(image)
                                    : `http://localhost:8000/${image}`
                              }
                          />
                        </ImageListItem>
                        <Button color="error" variant="contained" onClick={() => removeImageHandler(image)}>
                          Удалить
                        </Button>
                      </Stack>
                  ))}
                </ImageList>
            )}

            {/* ✅ ПРИВЯЗКА К ЦВЕТАМ */}
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

            <Button type="submit" variant="contained">
              Редактировать
            </Button>
          </Stack>
        </Box>
      </Box>
  );
};

export default UpdateProduct;
