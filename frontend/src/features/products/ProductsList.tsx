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
    const defaultProducts = useAppSelector(selectProducts);
    const loading = useAppSelector(selectProductsFetchLoading);
    const error = useAppSelector(selectProductsFetchError);

    const items = products ?? defaultProducts;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{ color: "#F0544F" }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="#F0544F" textAlign="center" mt={2} px={2}>
                Ошибка при загрузке товаров: {error}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(auto-fit, minmax(280px, 1fr))"
                },
                gap: { xs: 2, sm: 3 },
                px: { xs: 2, sm: 3 },
                width: "100%",
                maxWidth: "1200px",
                mx: "auto"
            }}
        >
            {items.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </Box>
    );
};

export default ProductList;