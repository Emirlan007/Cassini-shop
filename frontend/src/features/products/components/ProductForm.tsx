import {
    Button,
    CircularProgress, Divider,
    ImageList,
    ImageListItem,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import type {ProductInput} from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {
    selectCategories,
    selectFetchingCategories,
} from "../../categories/categorySlice.ts";
import {fetchCategories} from "../../categories/categoryThunk.ts";
import {useTranslation} from "react-i18next";

interface Props {
    onSubmit: (product: ProductInput) => void;
    loading: boolean;
}

const ProductForm = ({onSubmit, loading}: Props) => {
    const [isSizesOpen, setSizesOpen] = useState(false);
    const [isColorsOpen, setColorsOpen] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const categories = useAppSelector(selectCategories);
    const categoriesLoading = useAppSelector(selectFetchingCategories);
    const {t} = useTranslation();

    const MAX_IMAGES = 10;

    const [state, setState] = useState<ProductInput>({
        name: "",
        description: "",
        category: "",
        size: [],
        colors: [],
        price: 0,
        images: [],
        video: null,
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState((prev) => ({...prev, [name]: value}));
    };

    const imagesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        setState((prev) => {
            const existing = prev.images || [];
            const total = existing.length + newFiles.length;

            if (total > MAX_IMAGES) {
                alert(`Максимум ${MAX_IMAGES} изображений`);
                return prev;
            }

            return {...prev, images: [...existing, ...newFiles]};
        });
    };

    const removeImageHandler = (file: File) => {
        setState((prev) => ({
            ...prev,
            images: prev.images?.filter((i) => i !== file) || [],
        }));
    };

    const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setState((prev) => ({...prev, video: file}));
    };

    const handleSizeChange = (value: string, checked: boolean) => {
        setState((prev) => ({
            ...prev,
            size: checked
                ? [...prev.size, value]
                : prev.size.filter((s) => s !== value),
        }));
    };

    const handleColorsChange = (value: string, checked: boolean) => {
        setState((prev) => ({
            ...prev,
            colors: checked
                ? [...prev.colors, value]
                : prev.colors.filter((c) => c !== value),
        }));
    };

    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            onSubmit(state);
            navigate("/");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Stack spacing={2} component="form" onSubmit={submitFormHandler}>
            <TextField
                select
                id="category"
                label={t("productForm.category")}
                name="category"
                value={state.category}
                onChange={(e) =>
                    setState((prev) => ({...prev, category: e.target.value}))
                }
                required
            >
                <MenuItem value="" disabled>
                    Please select a category
                </MenuItem>

                {categoriesLoading && (
                    <div style={{marginLeft: "15px"}}>
                        <CircularProgress/>
                    </div>
                )}

                {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                        {cat.title}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                id="name"
                label={t("productForm.name")}
                name="name"
                value={state.name}
                onChange={inputChangeHandler}
                required
            />

            <TextField
                multiline
                minRows={3}
                id="description"
                label={t("productForm.description")}
                name="description"
                value={state.description}
                onChange={inputChangeHandler}
                required
            />

            <TextField
                type="number"
                id="price"
                label={t("productForm.price")}
                name="price"
                value={state.price}
                onChange={inputChangeHandler}
                required
            />

            <SizesModal
                open={isSizesOpen}
                onClose={() => setSizesOpen(false)}
                sizes={state.size}
                onChange={handleSizeChange}
            />
            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                alignItems={"center"}
            >
                <TextField
                    sx={{width: "100%"}}
                    label={t("productForm.selectedSizes")}
                    value={state.size.join(", ")}
                    InputProps={{readOnly: true}}
                />
                <Button
                    variant="contained"
                    onClick={() => setSizesOpen(true)}
                    sx={{width: {xs: "100%", sm: "20%", md: "15%"}}}
                >
                    {t("productForm.sizes")}
                </Button>
            </Stack>

            <ColorsModal
                open={isColorsOpen}
                onClose={() => setColorsOpen(false)}
                colors={state.colors}
                onChange={handleColorsChange}
            />
            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                alignItems={"center"}
            >
                <TextField
                    sx={{width: "100%"}}
                    label={t("productForm.selectedColors")}
                    value={state.colors.join(", ")}
                    InputProps={{readOnly: true}}
                />
                <Button
                    variant="contained"
                    onClick={() => setColorsOpen(true)}
                    sx={{width: {xs: "100%", sm: "20%", md: "15%"}}}
                >
            {t("productForm.colors")}
                </Button>
            </Stack>

            <FileInput label={t("productForm.images")} name="images" onChange={imagesChangeHandler}/>

            {state.images?.length ? (
                <ImageList cols={10} rowHeight={164}>
                    {state.images.map((image, index) => (
                        <Stack key={index}>
                            <ImageListItem>
                                <img
                                    src={
                                        image instanceof File
                                            ? URL.createObjectURL(image)
                                            : `http://localhost:8000/${image}`
                                    }
                                />
                            </ImageListItem>
                            <Button
                                onClick={() => removeImageHandler(image)}
                                color="error"
                                variant="contained"
                            >
                                {t("remove")}
                            </Button>
                        </Stack>
                    ))}
                </ImageList>
            ) : null}

            <FileInput label={t("productForm.video")} name="video" onChange={videoChangeHandler}/>

            <Divider sx={{my: 1}}/>

            <Button type="submit" variant="contained" disabled={loading}>
                {loading ? t("productForm.creating") : t("productForm.create")}
            </Button>
        </Stack>
    );
};

export default ProductForm;
