import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectWishlist,
    selectWishlistLoading,
    selectWishlistError,
} from "./wishlistSlice";
import { fetchWishlist } from "./wishlistThunks";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Container,
    Paper,
} from "@mui/material";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import ProductCard from "../products/ProductCard";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
    const dispatch = useAppDispatch();
    const wishlist = useAppSelector(selectWishlist);
    const loading = useAppSelector(selectWishlistLoading);
    const error = useAppSelector(selectWishlistError);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                >
                    <CircularProgress size={48} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Box textAlign="center" py={6}>
                    <Typography color="error" variant="h6">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!wishlist || wishlist.products.length === 0) {
        return (
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="60vh"
                    gap={2}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                            mb: 1,
                        }}
                    >
                        <FavoriteBorderOutlined
                            sx={{ fontSize: 60, color: "grey.400" }}
                        />
                    </Paper>
                    <Typography
                        variant="h5"
                        color="text.primary"
                        fontWeight={600}
                        gutterBottom
                    >
                        Список избранного пуст
                    </Typography>
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 2 }}
                    >
                        Добавьте товары в избранное, чтобы не потерять их
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/")}
                        sx={{
                            mt: 1,
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                        }}
                    >
                        Перейти к покупкам
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: { xs: 2, md: 4 } }}>
                <Box
                    sx={{
                        mb: { xs: 3, md: 4 },
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: "1.75rem", md: "2.125rem" }
                        }}
                    >
                        Избранное
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "text.secondary",
                            fontWeight: 400,
                            fontSize: { xs: "1.25rem", md: "1.5rem" }
                        }}
                    >
                        ({wishlist.products.length})
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={{ xs: 2, sm: 2.5, md: 3 }}
                    sx={{
                        "& .MuiGrid-item": {
                            display: "flex",
                        }
                    }}
                >
                    {wishlist.products.map((product) => (
                        <Grid
                            item
                            xs={6}
                            sm={6}
                            md={4}
                            lg={3}
                            key={product._id}
                        >
                            <Box sx={{ width: "100%" }}>
                                <ProductCard product={product} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Wishlist;