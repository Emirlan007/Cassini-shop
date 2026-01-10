import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      p={3}
      gap={3}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 30, sm: 40, md: 50 },
          fontWeight: 700,
          color: "secondary.main",
          textAlign: "center",
        }}
      >
        {t("pageNotFound")}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: "700",
          padding: "10px 28px",
          backgroundColor: "#660033",
          "&:hover": {
            backgroundColor: "#4d0026",
          },
        }}
      >
        {t("toMainPage")}
      </Button>
    </Box>
  );
};

export default PageNotFound;
