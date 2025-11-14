import { Button, Stack, TextField} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput.tsx";
import {type ChangeEvent, type FormEvent, useState} from "react";
import type { ProductInput } from "../../../types";
import SizesModal from "../../../components/UI/SizesModal/SizesModal.tsx";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal.tsx";

interface Props {
    onSubmit: (product: ProductInput) => void;
    loading: boolean;
}

const ProductForm = ({ onSubmit, loading }: Props) => {
    const [isSizesOpen, setSizesOpen] = useState(false);
    const [isColorsOpen, setColorsOpen] = useState(false);

    const [state, setState] = useState<ProductInput>({
        name: '',
        description: '',
        size: [],
        colors: [],
        price: 0,
        images: null,
        video: '',
    });


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setState((prevState) => ({ ...prevState, [name]: value }));
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
            <FileInput label="Image" name="image" onChange={fileInputChangeHandler} />
            <FileInput label="Video" name="video" onChange={fileInputChangeHandler} />
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
