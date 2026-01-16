import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { Product } from "../../../types";
import { addItemToCart, fetchCart } from "../../cart/cartThunks";
import { useWishlist } from "../hooks/useWishlist";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  fetchProductById,
  updateProductDiscount,
} from "../admin/adminProductsThunks";
import toast from "react-hot-toast";
import { trackAddToCart } from "../../../analytics/analytics";
import {
  selectUpdateDiscountError,
  selectUpdateDiscountLoading,
} from "../admin/adminProductsSlice";

interface Props {
  product: Product;
  selectedColor: string | false;
  selectedSize: string | null;
  finalPrice?: number;
  isAdmin: boolean;
}

const ProductActions: React.FC<Props> = ({
                                           product,
                                           selectedColor,
                                           selectedSize,
                                           finalPrice,
                                           isAdmin,
                                         }) => {
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [discountUntilValue, setDiscountUntilValue] = useState<string>("");
  const dispatch = useAppDispatch();

  const updateDiscountLoading = useAppSelector(selectUpdateDiscountLoading);

  const updateDiscountError = useAppSelector(selectUpdateDiscountError);

  const { isInWishlist, toggleWishlist } = useWishlist(product._id);

  const { t } = useTranslation();

  const getCurrentImages = useMemo(() => {
    if (!product?.images || product.images.length === 0) return [];

    if (!selectedColor || !product.imagesByColor?.[selectedColor]) {
      return product.images;
    }

    const imageIndices = product.imagesByColor[selectedColor];
    return imageIndices
      .map((idx) => product.images![idx])
      .filter((img) => img !== undefined);
  }, [product, selectedColor]);

  const handleDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === "") {
      setDiscountValue("");
      return;
    }

    const numericValue = Math.max(0, Math.min(100, Number(value)));
    setDiscountValue(numericValue.toString());
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) return;

    const productImage = getCurrentImages[0] || product.images?.[0] || "";

    trackAddToCart(product._id);

    await dispatch(
      addItemToCart({
        product: product._id,
        title: product.name,
        price: product.finalPrice ?? product.price,
        finalPrice: product.finalPrice ?? product.price,
        quantity: 1,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        image: productImage,
      })
    );

    await dispatch(fetchCart());

    toast.success(t("itemAddedToCart"));
  };

  const handleDiscountSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product || discountValue === "" || discountUntilValue === "") return;

    try {
      await dispatch(
        updateProductDiscount({
          productId: product._id,
          discountData: {
            discount: Number(discountValue),
            discountUntil: discountUntilValue,
          },
        })
      ).unwrap();
      toast.success("Скидка обновлена");
      await dispatch(fetchProductById(product._id));
    } catch {
      toast.error("Не удалось обновить скидку");
    }
  };

  const isDisabled = !selectedColor || !selectedSize;

  const isDiscountValid =
    discountValue !== "" &&
    Number(discountValue) >= 0 &&
    Number(discountValue) <= 100 &&
    discountUntilValue !== "";

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <Box mt={4}>
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
          mb={isAdmin ? 2 : 0}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              color: "#660033",
              display: { xs: "block", sm: "none" },
              alignSelf: "center",
            }}
          >
            {finalPrice} сом
          </Typography>
          <Box
            component="div"
            style={{ display: "flex", width: "100%", gap: "10px" }}
          >
            <Button
              sx={{ width: "60%" }}
              variant="contained"
              disabled={isDisabled}
              onClick={handleAddToCart}
              data-testid="add-to-cart"
            >
              {t("addToCart")}
            </Button>
            <Button
              onClick={toggleWishlist}
              sx={{
                color: "#808080",
                border: "1px solid #808080",
                borderRadius: "10%",
              }}
              data-testid="toggle-is-product-in-wishlist"
              data-active={isInWishlist}
            >
              <Box
                sx={{
                  color: isInWishlist ? "#ff4444" : "inherit",
                  "&:hover": {
                    backgroundColor: "rgba(255, 68, 68, 0.1)",
                  },
                }}
              >
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
              </Box>
            </Button>
          </Box>
        </Box>
        {isAdmin && (
          <Box
            component="form"
            onSubmit={handleDiscountSubmit}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "stretch", sm: "center" },
              mt: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <TextField
              label="Размер скидки (%)"
              type="number"
              value={discountValue}
              onChange={handleDiscountChange}
              required
              inputProps={{ min: 0, max: 100 }}
              sx={{ flex: { xs: "1 1 auto", sm: "0 0 150px" } }}
            />
            <TextField
              label="Действует до"
              type="date"
              value={discountUntilValue}
              onChange={(event) => setDiscountUntilValue(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: todayDate }}
              required
              sx={{ flex: { xs: "1 1 auto", sm: "0 0 180px" } }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!isDiscountValid || updateDiscountLoading}
              sx={{
                flex: { xs: "1 1 auto", sm: "0 0 200px" },
                minHeight: "56px",
              }}
            >
              {updateDiscountLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Подтвердить скидку"
              )}
            </Button>
          </Box>
        )}
      </Box>
      {isAdmin && updateDiscountError && (
        <Typography color="#F0544F" mt={1}>
          {updateDiscountError}
        </Typography>
      )}
    </>
  );
};

export default ProductActions;
