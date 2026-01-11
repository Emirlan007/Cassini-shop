import type { ICategory, ProductInput } from "../../types";
import { type FC, type FormEvent, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectCategories } from "../categories/categorySlice.ts";
import { fetchCategories } from "../categories/categoryThunk.ts";
import { useProductForm } from "./hooks/useProductForm";
import { useMediaFiles } from "./hooks/useMediaFiles";
import ProductFormFields from "./components/ProductFormFields";
import SizesSelector from "./components/SizesSelector";
import ColorsSelector from "./components/ColorsSelector";
import MediaUploader from "./components/MediaUploader";

interface Props {
  product: Omit<ProductInput, "category"> & {
    category: ICategory;
    material?: string;
    inStock?: boolean;
    isPopular?: boolean;
  };
  onSubmit(product: ProductInput): void;
}

const UpdateProductForm: FC<Props> = ({ product, onSubmit }) => {
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
    toggleImageColor,
  } = useProductForm({
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

  const { fileInputChangeHandler, videoChangeHandler, removeImageHandler } =
      useMediaFiles(setState);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(state);
    navigate("/admin/products");
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
            sx={{ mt: 3, width: "100%" }}
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

            <SizesSelector sizes={state.size} onSizeUpdate={handleSizeUpdate} />

            <ColorsSelector
                colors={state.colors}
                onColorsUpdate={handleColorsUpdate}
            />

            <MediaUploader
                images={state.images}
                video={state.video}
                colors={state.colors}
                imagesByColor={state.imagesByColor}
                onImagesChange={fileInputChangeHandler}
                onVideoChange={videoChangeHandler}
                onRemoveImage={removeImageHandler}
                onToggleImageColor={toggleImageColor}
            />

            <Button type="submit" fullWidth variant="contained">
              Редактировать
            </Button>
          </Stack>
        </Box>
      </Box>
  );
};

const UpdateProduct: FC<Props> = (props) => {
  const { id } = useParams();

  return <UpdateProductForm key={id || props.product.category._id} {...props} />;
};

export default UpdateProduct;