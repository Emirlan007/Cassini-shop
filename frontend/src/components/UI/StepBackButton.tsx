import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

interface Props {
    onBack: () => void;
}

const StepBackButton = ({ onBack }: Props) => {
    const { t } = useTranslation();

    return (
        <Tooltip title={t("back")} arrow>
            <IconButton
                onClick={onBack}
                sx={{
                    color: "#374151",
                    marginBottom: 2,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                }}
                aria-label={t("back")}
            >
                <ArrowBackIcon />
            </IconButton>
        </Tooltip>
    );
};

export default StepBackButton;