import type { ICategory, ProductInput } from "../../types";
import { type FC, type FormEvent, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectCategories } from "../categories/categorySlice.ts";
import { fetchCategories } from "../categories/categoryThunk.ts";
import { useProductForm } from "./hooks/useProductForm.ts";
import { useMediaFiles } from "./hooks/useMediaFiles.ts";
import ProductFormFields from "./components/ProductFormFields.tsx";
import SizesSelector from "./components/SizesSelector.tsx";
import ColorsSelector from "./components/ColorsSelector.tsx";
import MediaUploader from "./components/MediaUploader.tsx";

interface Props {
  product: Omit<ProductInput, "category"> & { category: ICategory } & {
    material?: string;
    inStock?: boolean;
    isPopular?: boolean;
  };
  onSubmit(product: ProductInput): void;
}

const UpdateProduct: FC<Props> = ({ product, onSubmit }) => {
  const navigate = useNavigate();
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const {
    state,
    setState,
    inputChangeHandler,
    handleCheckboxChange,
    handleSizeUpdate,
    handleColorsUpdate,
  } = useProductForm({
    name: product.name,
    description: product.description,
    size: product.size,
    colors: product.colors,
    category: product.category?._id ?? null,
    images: product.images,
    video: product.video,
    price: product.price,
    material: product.material || "",
    inStock: product.inStock ?? true,
    isPopular: product.isPopular ?? false,
  });

  const { handleImagesChange, handleVideoChange, removeImage } =
    useMediaFiles();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(state);
    navigate("/");
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
      <Box
        component="form"
        onSubmit={submitFormHandler}
        sx={{
          mt: 3,
          width: "100%",
        }}
      >
        <Stack spacing={2}>
          <ProductFormFields
            name={state.name}
            description={state.description}
            price={state.price}
            material={state.material}
            inStock={state.inStock}
            isPopular={state.isPopular}
            category={state.category}
            categories={categories}
            onInputChange={inputChangeHandler}
            onCheckboxChange={handleCheckboxChange}
          />

          <SizesSelector
            selectedSizes={state.size}
            onSizeUpdate={handleSizeUpdate}
          />

          <ColorsSelector
            selectedColors={state.colors}
            onColorUpdate={handleColorsUpdate}
          />

          <MediaUploader
            images={state.images}
            video={state.video}
            onImagesChange={(e) =>
              handleImagesChange(e, state.images, setState)
            }
            onVideoChange={(e) => handleVideoChange(e, setState)}
            onRemoveImage={(image) => removeImage(image, setState)}
          />

          <Button type="submit" fullWidth variant="contained">
            Редактировать
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UpdateProduct;
