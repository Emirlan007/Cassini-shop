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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!wishlist || wishlist.products.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="50vh"
                gap={3}
            >
                <FavoriteBorderOutlined sx={{ fontSize: 80, color: "#ccc" }} />
                <Typography variant="h5" color="text.secondary">
                    Ваш список избранного пуст
                </Typography>
                <Typography color="text.secondary">
                    Добавьте товары в избранное, чтобы не потерять их
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Перейти к покупкам
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Избранное ({wishlist.products.length})
            </Typography>

            <Grid container spacing={2}>
                {wishlist.products.map((product) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={product._id} {...({} as any)}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Wishlist;