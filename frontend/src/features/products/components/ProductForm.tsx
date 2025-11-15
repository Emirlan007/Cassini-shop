import { Button, Stack, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import { type ChangeEvent, type FormEvent, useState, useEffect } from "react";
import type { ProductInput, ICategory } from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";
import { axiosApi } from "../../../axiosApi";

interface Props {
    onSubmit: (product: ProductInput) => void;
    loading: boolean;
}

const ProductForm = ({ onSubmit, loading }: Props) => {
    const [isSizesOpen, setSizesOpen] = useState(false);
    const [isColorsOpen, setColorsOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [state, setState] = useState<ProductInput>({
        name: '',
        description: '',
        size: [],
        colors: [],
        category: '',
        price: 0,
        images: null,
        video: null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axiosApi.get<ICategory[]>('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const filesInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            setState((prevState) => ({
                ...prevState,
                [name]: Array.from(files)
            }));
        }
    };

    const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            setState((prevState) => ({ ...prevState, [name]: files[0] }));
        }
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
        onSubmit(state);
    };

    return (
        <Stack spacing={2} component="form" onSubmit={submitFormHandler}>
            <TextField
                id="name"
                label="Name"
                name="name"
                value={state.name}
                onChange={inputChangeHandler}
                required
            />
            <TextField
                multiline
                minRows={3}
                id="description"
                label="Description"
                name="description"
                value={state.description}
                onChange={inputChangeHandler}
                required
            />
            <TextField
                type="number"
                id="price"
                label="Price"
                name="price"
                value={state.price}
                onChange={inputChangeHandler}
                required
            />

            <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={state.category}
                    label="Category"
                    onChange={(e) => setState(prev => ({ ...prev, category: e.target.value }))}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                            {cat.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                    InputProps={{ readOnly: true }}
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
                    InputProps={{ readOnly: true }}
                />
                <Button variant="contained" onClick={() => setColorsOpen(true)}>Colors</Button>
            </Stack>

            <FileInput
                label="Images"
                name="images"
                onChange={filesInputChangeHandler}
                multiple
            />

            <FileInput
                label="Video"
                name="video"
                onChange={fileInputChangeHandler}
            />

            <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create'}
            </Button>
        </Stack>
    );
};

export default ProductForm;