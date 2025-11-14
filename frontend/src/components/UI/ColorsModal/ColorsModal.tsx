import {Box, Checkbox, FormControlLabel, Modal, Stack} from "@mui/material";
import type {ChangeEvent} from "react";

interface ColorsModalProps {
    open: boolean;
    onClose: () => void;
    colors: string[];
    onChange: (value: string, checked: boolean) => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ColorsModal = ({ open, onClose, colors, onChange }: ColorsModalProps) => {

    const handleColorsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        onChange(value, checked);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Stack mb={2}>Выберите цветов</Stack>
                <Stack direction="row" spacing={2}>
                    {["Black", "Silver", "White", "Red"].map(color => (
                        <FormControlLabel
                            key={color}
                            control={
                                <Checkbox
                                    value={color}
                                    checked={colors.includes(color)}
                                    onChange={handleColorsChange}
                                />
                            }
                            label={color}
                        />
                    ))}
                </Stack>
            </Box>
        </Modal>
    );
};

export default ColorsModal;