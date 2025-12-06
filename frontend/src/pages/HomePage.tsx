import {Box, Stack} from "@mui/material";
import BannersCarousel from "../features/banners/BannersCarousel.tsx";
import PopularProducts from "../features/products/components/PopularProducts.tsx";

const HomePage = () => {

    return (
        <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: { xs: 3, sm: 4 }, overflow: "hidden" }}>
            <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1408px",
                        mx: "auto",
                        px: { xs: 2, sm: 3 }
                    }}
                >
                    <BannersCarousel />
                </Box>
                <Box
                    alignSelf='flex-start'
                    sx={{
                        pl: {
                            // xl: 20,
                            // lg: 16,
                            // md: 12,
                            sm: 8,
                            xs: 4
                        }
                    }}
                >
                </Box>
            </Stack>
            <PopularProducts />
        </Box>
);
};

export default HomePage;