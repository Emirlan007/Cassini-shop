import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Button, alpha } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productsThunks";
import { 
    selectProducts, 
    selectProductsFetchLoading,
    selectProductsFetchError 
} from "../features/products/productsSlice";
import ProductList from "../features/products/ProductsList.tsx";

const CategoryProductsPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const products = useAppSelector(selectProducts);
    const loading = useAppSelector(selectProductsFetchLoading);
    const error = useAppSelector(selectProductsFetchError);

    useEffect(() => {
        if (categoryId) {
            dispatch(fetchProducts(categoryId));
        }
    }, [dispatch, categoryId]);
    const hasNoProducts = !loading && !error && products.length === 0;

    return (
        <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: { xs: 3, sm: 4 }}}>
            <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
                {hasNoProducts && (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", px: { xs: 2, sm: 4 }, mb: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate("/")}
                            sx={{
                                color: "secondary.main",
                                borderColor: "secondary.main",
                                "&:hover": {
                                    borderColor: "secondary.main",
                                    backgroundColor: alpha("#660033", 0.08),
                                },
                            }}
                        >
                            На главную
                        </Button>
                    </Box>
                )}
                
                {hasNoProducts ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "50vh",
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#660033",
                                fontWeight: 600,
                                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                                mb: 2,
                            }}
                        >
                            Тут ничего нет
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.secondary",
                                fontSize: { xs: "1rem", sm: "1.125rem" },
                                maxWidth: "500px",
                            }}
                        >
                            В данной категории пока нет товаров. Попробуйте выбрать другую категорию или вернитесь на главную страницу.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#660033",
                                fontWeight: 600,
                                textAlign: "center",
                                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                                px: 2
                            }}
                        >
                            Товары категории
                        </Typography>
                        <ProductList products={products} />
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default CategoryProductsPage;

