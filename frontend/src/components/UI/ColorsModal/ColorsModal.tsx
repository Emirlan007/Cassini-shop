import {Box, Button, Chip, Modal, Stack} from "@mui/material";
import {useState} from "react";

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
    const [currentColor, setCurrentColor] = useState("#000000");

    const handleAddColor = () => {
        if (!colors.includes(currentColor)) {
            onChange(currentColor, true);
        }
    };

    const handleRemoveColor = (color: string) => {
        onChange(color, false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleAddColor}>
                            Add Color
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {colors.map((color) => (
                            <Chip
                                style={{margin: '0 10px 10px 0'}}
                                key={color}
                                label={color}
                                sx={{
                                    backgroundColor: color,
                                    color: '#fff',
                                    '& .MuiChip-deleteIcon': {
                                        color: '#fff',
                                    }
                                }}
                                onDelete={() => handleRemoveColor(color)}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ColorsModal;