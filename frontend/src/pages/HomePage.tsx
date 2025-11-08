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
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: 4 }}>
            <Stack spacing={3} alignItems="center">
                <Typography
                    variant="h4"
                    sx={{
                        color: "#660033",
                        fontWeight: 600,
                        textAlign: "center",
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