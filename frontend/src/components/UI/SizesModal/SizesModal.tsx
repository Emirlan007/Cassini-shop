import {type ChangeEvent} from "react";
import {Box, Checkbox, FormControlLabel, Modal, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {AVAILABLE_SIZES} from "../../../constants/sizes.ts";

interface SizesModalProps {
    open: boolean;
    onClose: () => void;
    sizes: string[];
    onChange: (value: string, checked: boolean) => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: "90%", sm: "500px" },
    maxWidth: "90vw",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
};

const SizesModal = ({ open, onClose, sizes, onChange }: SizesModalProps) => {
    const { t } = useTranslation();

    const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        onChange(value, checked);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Stack mb={2}>{t("selectSizes")}</Stack>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                    {AVAILABLE_SIZES.map(size => (
                        <FormControlLabel
                            key={size}
                            control={
                                <Checkbox
                                    value={size}
                                    checked={sizes.includes(size)}
                                    onChange={handleSizeChange}
                                    color="primary"
                                />
                            }
                            label={size}
                            sx={{
                                minWidth: '80px',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '16px',
                                    fontWeight: 500
                                }
                            }}
                        />
                    ))}
                </Stack>
            </Box>
        </Modal>
    );
};

export default SizesModal;