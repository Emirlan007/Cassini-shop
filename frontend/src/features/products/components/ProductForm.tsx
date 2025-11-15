import {Button, CircularProgress, ImageList, ImageListItem, MenuItem, Stack, TextField} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import type { ProductInput} from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectCategories, selectFetchingCategories} from "../../categories/categorySlice.ts";
import {fetchCategories} from "../../categories/categoryThunk.ts";

interface Props {
    onSubmit: (product: ProductInput) => void;
    loading: boolean;
}

const ProductForm = ({ onSubmit, loading }: Props) => {
    const [isSizesOpen, setSizesOpen] = useState(false);
    const [isColorsOpen, setColorsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const categoriesLoading = useAppSelector(selectFetchingCategories);

    const [state, setState] = useState<ProductInput>({
        name: '',
        description: '',
        category: '',
        size: [],
        colors: [],
        price: 0,
        images: null,
        video: null,
    });

    const MAX_IMAGES = 10;

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const imagesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        setState(prev => {
            const existing = prev.images || [];
            const total = existing.length + newFiles.length;

            if (total > MAX_IMAGES) {
                alert(`Максимум ${MAX_IMAGES} изображений`);
                return prev;
            }

            return {
                ...prev,
                images: [...existing, ...newFiles],
            };
        });
    };

    const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setState(prev => ({
            ...prev,
            video: file,
        }));
    };


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSizeChange = (value: string, checked: boolean) => {
        setState(prev => ({
            ...prev,
            size: checked
                ? [...prev.size, value]
                : prev.size.filter(s => s !== value)
        }));
    };

    const handleColorsChange = (value: string, checked: boolean) => {
        setState(prev => ({
            ...prev,
            colors: checked
                ? [...prev.colors, value]
                : prev.colors.filter(c => c !== value)
        }));
    };

    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Submitting state:", state);
        console.log("Colors:", state.colors);
        console.log("Size:", state.size);
        console.log("Category:", state.category);

        if (!state.category) {
            alert("Please select a category");
            return;
        }
        if (!state.colors.length) {
            alert("Please select at least one color");
            return;
        }
        if (!state.size.length) {
            alert("Please select at least one size");
            return;
        }

        try {
            onSubmit(state)
            navigate('/')
        } catch (e) {
            console.log(e)
        }

        setState(state)
    };

    const removeImageHandler = (file: File) => {
        setState(prev => ({
            ...prev,
            images: prev.images?.filter(i => i !== file) || []
        }));
    };

    return (
        <Stack spacing={2} component="form" onSubmit={submitFormHandler}>
            <TextField
                select
                id="category"
                label="Category"
                name="category"
                value={state.category}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setState(prev => ({ ...prev, category: e.target.value }))
                }
                required
            >
                <MenuItem value="" disabled>
                    Please select a category
                </MenuItem>
                {categoriesLoading && (
                    <div style={{ marginLeft: '15px' }}>
                        <CircularProgress />
                    </div>
                )}
                {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                        {category.title}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                id="name"
                label="Name"
                name="name"
                onChange={inputChangeHandler}
                required
            />
            <TextField
                multiline
                minRows={3}
                id="description"
                label="Description"
                name="description"
                onChange={inputChangeHandler}
                required
            />
            <TextField
                type="number"
                id="price"
                label="Price"
                name="price"
                onChange={inputChangeHandler}
                required
            />

            <SizesModal
                open={isSizesOpen}
                onClose={() => setSizesOpen(false)}
                sizes={state.size}
                onChange={handleSizeChange}
            />
            <Stack direction="row" spacing={2} alignItems={'center'}>
                <TextField
                    sx={{width:'100%', mr: 2}}
                    label="Selected Sizes"
                    value={state.size.join(", ")}
                />
                <Button variant="contained" onClick={() => setSizesOpen(true)} sx={{width: '94px'}}>Sizes</Button>
            </Stack>

            <ColorsModal
                open={isColorsOpen}
                onClose={() => setColorsOpen(false)}
                colors={state.colors}
                onChange={handleColorsChange}
            />
            <Stack direction="row" spacing={2} alignItems={'center'}>
                <TextField
                    sx={{width:'100%', mr: 2}}
                    label="Selected Colors"
                    value={state.colors.join(", ")}
                />
                <Button variant="contained" onClick={() => setColorsOpen(true)}>Colors</Button>
            </Stack>
            <FileInput label="Images" name="images" onChange={imagesChangeHandler} />
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
            <FileInput label="Video" name="video" onChange={videoChangeHandler} />
            <Button
                type="submit"
                color="primary"
                variant="contained"
                loading={loading}
            >
                Create
            </Button>
        </Stack>
    );
};

export default ProductForm;
