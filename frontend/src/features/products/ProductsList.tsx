import { Box, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import {
    selectProducts,
    selectProductsFetchLoading,
    selectProductsFetchError,
} from "./productsSlice";
import ProductCard from "./ProductCard";
import type {Product} from "../../types";

interface Props {
    products?: Product[];
}

const ProductList = ({ products }: Props) => {
    const loading = useAppSelector(selectProductsFetchLoading);
    const error = useAppSelector(selectProductsFetchError);
    const defaultProducts = useAppSelector(selectProducts);

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
            <Typography color="#F0544F" textAlign="center" mt={2}>
                Ошибка при загрузке товаров: {error}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(auto-fit, minmax(150px, 1fr))",
                    sm: "repeat(auto-fit, minmax(200px, 1fr))",
                    md: "repeat(auto-fit, minmax(250px, 1fr))",
                    lg: "repeat(auto-fit, minmax(280px, 1fr))",
                },
                gap: { xs: 2, sm: 3 },
                px: { xs: 1, sm: 2 },
                width: "100%",
                maxWidth: "1400px",
                mx: "auto",
            }}
        >
            {items.length === 0 && (
                <Box sx={{ textAlign: "center", textDecoration: "underline" }}>
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