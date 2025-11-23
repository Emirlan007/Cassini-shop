import { useEffect } from "react";
import {Box, Stack, Typography} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts } from "../features/products/productsThunks";
import { selectProducts } from "../features/products/productsSlice";
import ProductList from "../features/products/ProductsList.tsx";
import BannersCarousel from "../features/banners/BannersCarousel.tsx";
import { useTranslation } from "react-i18next";

const HomePage = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectProducts);
    const {t} = useTranslation()

    useEffect(() => {
        dispatch(fetchProducts(undefined));
    }, [dispatch]);

    return (
        <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: { xs: 3, sm: 4 }}}>
            <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
                <Box>
                    <BannersCarousel />
                </Box>
                <Box
                    alignSelf='flex-start'
                    sx={{
                        pl: {
                            xl: 20,
                            lg: 16,
                            md: 12,
                            sm: 8,
                            xs: 4
                        }
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            fontSize: '17px',
                            lineHeight: '125%',
                            letterSpacing: '-0.02em',
                            color: '#111827',
                        }}
                    >
                        {t("popularProducts")}
                    </Typography>
                </Box>
                <ProductList products={products} />
            </Stack>
        </Box>
    );
};

export default HomePage;