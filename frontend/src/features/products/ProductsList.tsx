import { Box, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import {
  selectProducts,
  selectProductsFetchLoading,
  selectProductsFetchError,
} from "./productsSlice";
import ProductCard from "./ProductCard";

interface Props {
  products?: ReturnType<typeof selectProducts>;
}

const ProductList = ({ products }: Props) => {
  const loading = useAppSelector(selectProductsFetchLoading);
  const error = useAppSelector(selectProductsFetchError);
  const items = products ?? useAppSelector(selectProducts);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#F0544F" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="#F0544F" textAlign="center" mt={2}>
        Ошибка при загрузке товаров: {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 3,
        px: 2,
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      {items.length == 0 && (
        <Box sx={{textAlign:"center", textDecoration:"underline"}}>
          <Typography variant="h3" component="h3">Nothing Found</Typography>
        </Box>
      )}
      {items.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </Box>
  );
};

export default ProductList;
