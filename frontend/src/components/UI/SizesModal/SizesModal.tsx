import {type ChangeEvent} from "react";
import {Box, Checkbox, FormControlLabel, Modal, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";

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
    width: "90%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {["XS", "S", "M", "L"].map(size => (
                        <FormControlLabel
                            key={size}
                            control={
                                <Checkbox
                                    value={size}
                                    checked={sizes.includes(size)}
                                    onChange={handleSizeChange}
                                />
                            }
                            label={size}
                        />
                    ))}
                </Stack>
            </Box>
        </Modal>
    );
};

export default SizesModal;