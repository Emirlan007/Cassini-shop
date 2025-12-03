import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    if (location.pathname === "/") {
        return null;
    }

    // if (location.pathname === "/login" || location.pathname === "/register") {
    //   return null;
    // }

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Tooltip title={t("back")} arrow>
            <IconButton
                onClick={handleGoBack}
                sx={{
                    color: "#374151",
                    marginRight: 0.5,
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

export default BackButton;