import type {ProductInput} from "../../types";
import {type ChangeEvent, type FC, type FormEvent, useEffect, useState} from "react";
import {
    Box,
    Button,
    ImageList,
    ImageListItem,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import FilesInput from "../../components/FilesInput/FilesInput.tsx";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectCategories} from "../categories/categorySlice.ts";
import {fetchCategories} from "../categories/categoryThunk.ts";

interface Props {
    product: ProductInput

    onSubmit(product: ProductInput): void
}

const UpdateProduct: FC<Props> = ({product, onSubmit}) => {
    const navigate = useNavigate();
    const categories = useAppSelector(selectCategories);
    const dispatch = useAppDispatch();

    const [state, setState] = useState<ProductInput>({
        name: product.name,
        description: product.description,
        size: product.size,
        colors: product.colors,
        category: product.category._id,
        images: product.images,
        video: product.video,
        price: product.price,
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
            // @ts-ignore
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


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState((prevState) => ({...prevState, [name]: value}));

        console.log(name, value)
    };

    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(state)

        onSubmit(state)
        navigate('/')

        setState(state)
    }

    const removeImageHandler = (image: File) => {

        setState(prevState => ({
            ...prevState,
            images: prevState.images && prevState.images.filter(i => i !== image)
        }))
    }

    const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setState(prev => ({
            ...prev,
            video: file,
        }));
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

                        <FilesInput label="Video" name="video" onChange={videoChangeHandler} />

                        <Stack>
                            <FilesInput
                                label="Images"
                                name="images"
                                onChange={fileInputChangeHandler}
                            />

                            {!state.images ? null :
                                <ImageList cols={10} rowHeight={164}>
                                    {state.images.map((image, index) => (
                                        <Stack key={index}>
                                            <ImageListItem>
                                                <img
                                                    src={image instanceof File ? URL.createObjectURL(image) : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format`}
                                                    srcSet={image instanceof File ? undefined : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                />
                                            </ImageListItem>
                                            <Button onClick={ () => removeImageHandler(image)} color={'error'} variant={'contained'}>Remove</Button>
                                        </Stack>
                                    ))}
                                </ImageList>}
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