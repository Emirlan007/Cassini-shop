import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectProduct,
    selectProductFetchError,
    selectProductFetchLoading,
} from "./productsSlice";
import { useEffect, useState } from "react";
import { fetchProductById } from "./productsThunks";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API_URL } from "../../constants";
import {selectUser} from "../users/usersSlice.ts";
import RegisterModal from "../users/components/RegisterModal.tsx";

const ProductDetails = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const dispatch = useAppDispatch();
    const product = useAppSelector(selectProduct);
    const loading = useAppSelector(selectProductFetchLoading);
    const error = useAppSelector(selectProductFetchError);
    const user = useAppSelector(selectUser);

    const { productId } = useParams() as { productId: string };

    useEffect(() => {
        dispatch(fetchProductById(productId));
    }, [dispatch, productId]);

    const imageUrl = API_URL + product?.images?.[currentImageIndex];

    const isFirstImage = currentImageIndex === 0;

    const isLastImage = currentImageIndex === (product?.images?.length ?? 0) - 1;

    const handlePrevClick = () => {
        setCurrentImageIndex((prev) => (!isFirstImage ? prev - 1 : prev));
    };

    const handleNextClick = () => {
        setCurrentImageIndex((prev) => (!isLastImage ? prev + 1 : prev));
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography textAlign="center" mt={2}>
                Ошибка при загрузке товара: {error}
            </Typography>
        );
    }

    return (
        <>
            <Stack
                sx={{
                    height: { xs: 180, sm: 250, md: 400 },
                    backgroundColor: "#00000033",
                    borderRadius: 1,
                    justifyContent: "space-between",
                }}
                direction="row"
            >
                <IconButton
                    sx={{
                        borderRadius: 0,
                    }}
                    onClick={handlePrevClick}
                    disabled={isFirstImage}
                >
                    <ArrowBackIosNewIcon color={isFirstImage ? "disabled" : "action"} />
                </IconButton>
                <img src={imageUrl} alt={product?.name} />
                <IconButton
                    sx={{
                        borderRadius: 0,
                    }}
                    onClick={handleNextClick}
                    disabled={isLastImage}
                >
                    <ArrowForwardIosIcon color={isLastImage ? "disabled" : "action"} />
                </IconButton>
            </Stack>

            <Typography variant="h6">
                <b>{product?.name}</b>
            </Typography>
            <Typography variant="h5">
                <b>{product?.price}</b>
            </Typography>
            <Typography variant="body1">{product?.description}</Typography>

            <RegisterModal
                handleClose={handleClose}
                handleOpen={handleOpen}
                open={open}
            />

            <Button onClick={() => user ? null : handleOpen()} variant='contained' sx={{mt: 3}}>Order</Button>
        </>
    );
};

export default ProductDetails;
