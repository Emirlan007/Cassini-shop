import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {Typography} from "@mui/material";
import ProductForm from "./components/ProductForm.tsx";
import type {ProductInput} from "../../types";
import {createProduct, fetchProducts} from "./productsThunks.ts";
import {selectProductCreateLoading} from "./productsSlice.ts";


const NewProduct = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const productCreating = useAppSelector(selectProductCreateLoading)

    const onFormSubmit = async (product: ProductInput) => {
        await dispatch(createProduct(product)).unwrap();
        dispatch(fetchProducts());
        navigate('/');
    };
    return (
        <>
            <Typography variant="h4" sx={{ mb: 2 }}>
                New Product
            </Typography>
            <ProductForm onSubmit={onFormSubmit} loading={productCreating} />
        </>
    );
};

export default NewProduct;