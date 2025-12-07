import {
    Box,
    Button,
    Card,
    CardContent, Checkbox,
    Chip,
    CircularProgress, Divider, FormControlLabel,
    ImageList,
    ImageListItem,
    MenuItem,
    Stack,
    TextField, Typography,
} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import type {ProductInput} from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";
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
        inStock: true,
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
        setState((prev) => {
            const newColors = checked
                ? [...prev.colors, value]
                : prev.colors.filter((c) => c !== value);

            let updatedImagesByColor = prev.imagesByColor || {};

            if (!checked && updatedImagesByColor[value]) {
                const clone = {...updatedImagesByColor};
                delete clone[value];
                updatedImagesByColor = clone;
            }

            return {
                ...prev,
                colors: newColors,
                imagesByColor: updatedImagesByColor,
            };
        });
    };

    const handleImageColorBinding = (color: string, imageIndex: number, checked: boolean) => {
        setState((prev) => {
            const map = prev.imagesByColor ? {...prev.imagesByColor} : {};

            const existing = map[color] || [];

            map[color] = checked
                ? [...existing, imageIndex]
                : existing.filter((i) => i !== imageIndex);

            return {
                ...prev,
                imagesByColor: map,
            };
        });
    };

    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('=== FORM SUBMIT ===');
        console.log('state.inStock:', state.inStock);
        console.log('state.size:', state.size);

        const filteredImagesByColor =
            state.imagesByColor &&
            Object.fromEntries(
                Object.entries(state.imagesByColor)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, indexes]) => indexes.length > 0)
                    .map(([color, indexes]) => [
                        color,
                        indexes.filter((i) => state.images && state.images[i]),
                    ])
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, validArr]) => validArr.length > 0)
            );

        const dataToSend: ProductInput = {
            name: state.name,
            description: state.description || "",
            category: state.category,
            size: state.size,
            colors: state.colors,
            price: state.price,
            images: state.images || null,
            video: state.video || null,
            inStock: state.inStock ?? true,
            imagesByColor:
                filteredImagesByColor &&
                Object.keys(filteredImagesByColor).length > 0
                    ? filteredImagesByColor
                    : undefined,
        };

        console.log("Submitting:", dataToSend);

        onSubmit(dataToSend);
    };

    const isImageSelectedForColor = (color: string, imageIndex: number) => {
        return state.imagesByColor?.[color]?.includes(imageIndex) || false;
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

            <FormControlLabel
                control={
                    <Checkbox
                        checked={state.inStock}
                        onChange={(e) => setState(prev => ({...prev, inStock: e.target.checked}))}
                        name="inStock"
                    />
                }
                label="В наличии"
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
                    value={state.size.length > 0 ? state.size.join(", ") : "No sizes selected"}
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
                <Stack spacing={2}>
                    <Typography variant="h6">{t("productForm.uploadedImages")}</Typography>
                    <ImageList cols={5} rowHeight={164}>
                        {state.images.map((image, index) => (
                            <Stack key={index} spacing={1}>
                                <ImageListItem>
                                    <img
                                        src={
                                            image instanceof File
                                                ? URL.createObjectURL(image)
                                                : `http://localhost:8000/${image}`
                                        }
                                        alt={`Image ${index + 1}`}
                                        style={{width: '100%', height: '150px', objectFit: 'cover'}}
                                    />
                                </ImageListItem>
                                <Button
                                    onClick={() => removeImageHandler(image)}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                >
                                    {t("remove")}
                                </Button>
                            </Stack>
                        ))}
                    </ImageList>

                    {state.colors.length > 0 && (
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {t("productForm.colorImageBinding")}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t("productForm.colorImageDescription")}
                                </Typography>

                                <Stack spacing={3} mt={2}>
                                    {state.colors.map((color) => (
                                        <Box key={color}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                <Chip
                                                    label={color}
                                                    sx={{
                                                        backgroundColor: color.toLowerCase(),
                                                        color: 'white',
                                                        mb: 1
                                                    }}
                                                />
                                            </Typography>

                                            <Stack direction="row" flexWrap="wrap" gap={2}>
                                                {state.images?.map((image, imageIndex) => (
                                                    <Box key={imageIndex} sx={{ width: 120 }}>
                                                        <Stack alignItems="center" spacing={1}>
                                                            <img
                                                                src={
                                                                    image instanceof File
                                                                        ? URL.createObjectURL(image)
                                                                        : `http://localhost:8000/${image}`
                                                                }
                                                                alt={`Image ${imageIndex + 1}`}
                                                                style={{
                                                                    width: '100px',
                                                                    height: '100px',
                                                                    objectFit: 'cover',
                                                                    border: isImageSelectedForColor(color, imageIndex)
                                                                        ? '3px solid #1976d2'
                                                                        : '1px solid #ddd'
                                                                }}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={isImageSelectedForColor(color, imageIndex)}
                                                                        onChange={(e) =>
                                                                            handleImageColorBinding(color, imageIndex, e.target.checked)
                                                                        }
                                                                    />
                                                                }
                                                                label={`Image ${imageIndex + 1}`}
                                                            />
                                                        </Stack>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>

                                {state.imagesByColor && Object.keys(state.imagesByColor).length > 0 && (
                                    <Box mt={3}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {t("productForm.currentBindings")}
                                        </Typography>
                                        {Object.entries(state.imagesByColor).map(([color, imageIndices]) => (
                                            <Box key={color} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <Chip
                                                    label={color}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: color.toLowerCase(),
                                                        color: 'white',
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography variant="body2" component="span">
                                                    → Images: {imageIndices.map(idx => idx + 1).join(', ')}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </Stack>
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