import { useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productsThunks";
import { selectProducts } from "../features/products/productsSlice";
import ProductList from "../features/products/ProductsList.tsx";
import BannersCarousel from "../features/banners/BannersCarousel.tsx";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectProducts);

    useEffect(() => {
        dispatch(fetchProducts(undefined));
    }, [dispatch]);

    return (
        <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: { xs: 3, sm: 4 }}}>
            <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
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
                    Популярные товары
                </Typography>

                <Box>
                    <BannersCarousel />

                </Box>
                <ProductList products={products} />
            </Stack>
        </Box>
    );
};

export default HomePage;