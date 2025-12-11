import {
  TableRow,
  TableCell,
  Button,
  Box,
  Typography,
  Tooltip, Checkbox,
} from "@mui/material";
import type { Product } from "../../../../types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../constants";
import {useAppDispatch} from "../../../../app/hooks.ts";
import {fetchProducts, updateProductNewStatus, updateProductPopular} from "../../productsThunks.ts";
import type {ChangeEvent} from "react";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  removeProduct: (id: string) => void;
}

const AdminProductCard = ({ product, removeProduct }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangePopularStatus = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await dispatch(
          updateProductPopular({
            productId: product._id,
            isPopular: e.target.checked,
          })
      ).unwrap();
      dispatch(fetchProducts());
    } catch (error) {
      console.error(error);
      toast.error("Не удалось обновить статус популярности");
    }
  };

  const handleChangeNewStatus = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      await dispatch(
          updateProductNewStatus({
            productId: product._id,
            isNew: e.target.checked,
          })
      ).unwrap();
      dispatch(fetchProducts());
    } catch (error) {
      console.error(error);
      toast.error("Не удалось обновить статус новизны");
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return `${API_URL}${cleanPath}`;
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={handleClick}
      data-testid={`admin-product-row-${product._id}`}
    >
      <TableCell
        padding="none"
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {product.images?.[0] ? (
            <Tooltip
              title={
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  style={{
                    height: 300,
                    objectFit: "contain",
                  }}
                />
              }
              placement="right"
              arrow
            >
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  objectFit: "cover",
                }}
              />
            </Tooltip>
          ) : (
            <Typography variant="body2">Нет фото</Typography>
          )}
        </Box>
      </TableCell>

      <TableCell>{product._id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category?.title}</TableCell>
      <TableCell>{product.price} ⃀</TableCell>
      <TableCell align="center">
        {product.discount ? `${product.discount}%` : "-"}
      </TableCell>
      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
            checked={product.isPopular || false}
            onChange={handleChangePopularStatus}
        />
      </TableCell>
      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
            checked={product.isNew || false}
            onChange={handleChangeNewStatus}
        />
      </TableCell>
      <TableCell align="center">
        <Button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/products/${product._id}/update`);
          }}
          color="secondary"
          variant="contained"
          sx={{
            mr: 2,
            backgroundColor: "#660033",
            "&:hover": { backgroundColor: "#F0544F" },
          }}
        >
          edit
        </Button>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            removeProduct(product._id);
          }}
          color="secondary"
          variant="contained"
          sx={{
            backgroundColor: "#660033",
            "&:hover": { backgroundColor: "#F0544F" },
          }}
        >
          delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AdminProductCard;
