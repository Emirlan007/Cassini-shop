import type { ProductInput, Product } from "../../types";
import { type ChangeEvent, type FC, type FormEvent, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControlLabel,
    ImageList,
    ImageListItem,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import FilesInput from "../../components/FilesInput/FilesInput.tsx";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectCategories } from "../categories/categorySlice.ts";
import { fetchCategories } from "../categories/categoryThunk.ts";
import SizesModal from "../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../components/UI/ColorsModal/ColorsModal.tsx";

interface Props {
    product: Product;
    onSubmit: (product: ProductInput) => void;
}

const UpdateProduct: FC<Props> = ({product, onSubmit}) => {
    const [isSizesOpen, setSizesOpen] = useState(false);
    const [isColorsOpen, setColorsOpen] = useState(false);

    const categories = useAppSelector(selectCategories);
    const dispatch = useAppDispatch();

    const convertImagesByColorToIndices = (product: Product): Record<string, number[]> => {
        if (!product.imagesByColor || !product.images) return {};

        const result: Record<string, number[]> = {};

        Object.entries(product.imagesByColor).forEach(([color, imagePaths]) => {
            const indices: number[] = [];

            imagePaths.forEach((path) => {
                const index = product.images?.indexOf(path);
                if (index !== undefined && index !== -1) {
                    indices.push(index);
                }
            });

            if (indices.length > 0) {
                result[color] = indices;
            }
        });

        return result;
    };

    const [state, setState] = useState<ProductInput>({
        name: product.name,
        description: product.description || "",
        size: product.size,
        colors: product.colors,
        category: product.category._id,
        images: product.images || [],
        video: product.video || null,
        price: product.price,
        inStock: product.inStock ?? true,
        imagesByColor: convertImagesByColorToIndices(product),
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const MAX_IMAGES = 10;

    const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;

        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        setState(prev => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const existing = prev[name] || [];

            if (existing.length >= MAX_IMAGES) {
                alert(`Максимум можно загрузить ${MAX_IMAGES} изображений.`);
                return prev;
            }

            const availableSlots = MAX_IMAGES - existing.length;

            const filesToAdd = newFiles.slice(0, availableSlots);

            return {
                ...prev,
                [name]: [...existing, ...filesToAdd],
            };
        });
    };

    const handleSizeUpdate = (value: string, checked: boolean) => {
        setState((prev) => ({
            ...prev,
            size: checked
                ? [...prev.size, value]
                : prev.size.filter((s) => s !== value),
        }));
    };

    const handleColorsUpdate = (value: string, checked: boolean) => {
        setState((prev) => {
            const newColors = checked
                ? [...prev.colors, value]
                : prev.colors.filter((c) => c !== value);

            let updatedImagesByColor = prev.imagesByColor || {};

            if (!checked && updatedImagesByColor[value]) {
                const clone = { ...updatedImagesByColor };
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
            const map = prev.imagesByColor ? { ...prev.imagesByColor } : {};

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

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState((prevState) => ({...prevState, [name]: value}));

    };

    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            images: state.images || [],
            video: state.video,
            inStock: state.inStock ?? true,
            imagesByColor:
                filteredImagesByColor &&
                Object.keys(filteredImagesByColor).length > 0
                    ? filteredImagesByColor
                    : undefined,
        };

        console.log("Update Product - Submitting:", dataToSend);
        onSubmit(dataToSend);
    };

    const removeImageHandler = (image: File | string) => {
        setState(prevState => ({
            ...prevState,
            images: prevState.images?.filter(i => i !== image) || [],
        }));
    };

    const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setState(prev => ({
            ...prev,
            video: file,
        }));
    };

    const isImageSelectedForColor = (color: string, imageIndex: number) => {
        return state.imagesByColor?.[color]?.includes(imageIndex) || false;
    };

    return (
        <>
            <Box
                sx={{
                    marginTop: {xs: 4, sm: 8},
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    px: 2
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{color: '#660033'}}
                >
                    Update Product
                </Typography>
                <Box
                    component="form"
                    onSubmit={submitFormHandler}
                    sx={{
                        mt: 3,
                        width: '100%'
                    }}
                >
                    <Stack spacing={2}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={state.name}
                            onChange={inputChangeHandler}
                            autoComplete="name"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#660033',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                    '&:active fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#660033',
                                },
                            }}
                        />

                        <TextField
                            required
                            fullWidth
                            type="description"
                            label="Description"
                            name="description"
                            value={state.description}
                            onChange={inputChangeHandler}
                            autoComplete="new-description"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#660033',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                    '&:active fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#660033',
                                },
                            }}
                        />

                        <TextField
                            required
                            fullWidth
                            type="price"
                            label="price"
                            name="price"
                            value={state.price}
                            onChange={inputChangeHandler}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#660033',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                    '&:active fieldset': {
                                        borderColor: '#F0544F',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#660033',
                                },
                            }}
                        />

                        <TextField
                            select
                            id="category"
                            label="Category"
                            name="category"
                            value={state.category}
                            onChange={inputChangeHandler}
                            required
                        >
                            <MenuItem value="" disabled>
                                Please select a category
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.inStock ?? true}
                                    onChange={(e) => setState(prev => ({ ...prev, inStock: e.target.checked }))}
                                    name="inStock"
                                />
                            }
                            label="In Stock"
                        />

                        <SizesModal
                            open={isSizesOpen}
                            onClose={() => setSizesOpen(false)}
                            sizes={state.size}
                            onChange={handleSizeUpdate}
                        />
                        <Stack direction="row" spacing={2} alignItems={"center"}>
                            <TextField
                                sx={{ width: "100%" }}
                                label="Selected Sizes"
                                value={state.size.length > 0 ? state.size.join(", ") : "No sizes selected"}
                            />
                            <Button variant="contained" onClick={() => setSizesOpen(true)}>
                                Sizes
                            </Button>
                        </Stack>

                        <ColorsModal
                            open={isColorsOpen}
                            onClose={() => setColorsOpen(false)}
                            colors={state.colors}
                            onChange={handleColorsUpdate}
                        />
                        <Stack direction="row" spacing={2} alignItems={"center"}>
                            <TextField
                                sx={{ width: "100%" }}
                                label="Selected Colors"
                                value={state.colors.join(", ")}
                            />
                            <Button variant="contained" onClick={() => setColorsOpen(true)}>
                                Colors
                            </Button>
                        </Stack>

                        <FilesInput label="Video" name="video" onChange={videoChangeHandler} />

                        <Stack>
                            <FilesInput
                                label="Images"
                                name="images"
                                onChange={fileInputChangeHandler}
                            />

                            {state.images && state.images.length > 0 && (
                                <>
                                    <ImageList cols={10} rowHeight={164} sx={{ mt: 2 }}>
                                        {state.images.map((image, index) => (
                                            <Stack key={index}>
                                                <ImageListItem>
                                                    <img
                                                        src={image instanceof File ? URL.createObjectURL(image) : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format`}
                                                        alt={`Image ${index + 1}`}
                                                    />
                                                </ImageListItem>
                                                <Button
                                                    onClick={() => removeImageHandler(image)}
                                                    color={'error'}
                                                    variant={'contained'}
                                                >
                                                    Remove
                                                </Button>
                                            </Stack>
                                        ))}
                                    </ImageList>

                                    {state.colors.length > 0 && (
                                        <Card variant="outlined" sx={{ mt: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Привязка изображений к цветам
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Выберите какие изображения относятся к каждому цвету товара
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
                                                                                src={image instanceof File ? URL.createObjectURL(image) : `http://localhost:8000/${image}`}
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
                                                            Текущие привязки:
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
                                </>
                            )}
                        </Stack>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                bgcolor: '#F0544F',
                                color: '#FFFFFF',
                                '&:hover': {
                                    bgcolor: '#d14a48',
                                },
                                '&:disabled': {
                                    bgcolor: '#cccccc',
                                },
                            }}
                        >
                            Edit
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export default UpdateProduct;