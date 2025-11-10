import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectProduct,
  selectProductFetchError,
  selectProductFetchLoading,
} from "./productsSlice";
import { useEffect, useState } from "react";
import { fetchProductById } from "./productsThunks";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API_URL } from "../../constants";

const ProductDetails = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const loading = useAppSelector(selectProductFetchLoading);
  const error = useAppSelector(selectProductFetchError);

  const { productId } = useParams() as { productId: string };

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const imageUrl = API_URL + product?.images?.[currentImageIndex];

  const isFirstImage = currentImageIndex === 0;

  const isLastImage = currentImageIndex === (product?.images?.length ?? 0) - 1;

  const handlePrevClick = () => {
    setCurrentImageIndex((prev) => (!isFirstImage ? prev - 1 : prev));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (!isLastImage ? prev + 1 : prev));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography textAlign="center" mt={2}>
        Ошибка при загрузке товара: {error}
      </Typography>
    );
  }

  return (
    <>
      <Box component="div" sx={{ display: "flex", gap:1, paddingRight:2}}>
        <Box component="div">
          <img height={300} src={imageUrl} alt={product?.name} />
        </Box>
        <Box component="div" sx={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
          <Typography variant="h6" sx={{fontSize:"17px"}}>
            <b>{product?.name}</b>
          </Typography>
          <Typography variant="subtitle2" sx={{fontSize:"13px"}}>
            <b>Price: {product?.price}</b>
          </Typography>
          <Typography variant="body1" sx={{fontSize:"11px"}}>{product?.description}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProductDetails;
