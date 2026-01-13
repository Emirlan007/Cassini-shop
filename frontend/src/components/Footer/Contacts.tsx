import { Box, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

const Contacts = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" gap={2} flexDirection={"column"} alignItems={"center"}>
      <Typography
        variant={"h6"}
        component={"h6"}
        sx={{ color: "#1F2937", fontSize: "13px", fontWeight: "bold" }}
      >
        {t("contacts")}
      </Typography>
      <Link
        sx={{
          color: " #808080",
          textDecoration: "none",
          "&:hover": { color: "#F0544F" },
          fontSize: "11px",
        }}
        href="mailto:example@gmail.com"
      >
        {t("email")}
      </Link>
      <Link
        sx={{
          color: " #808080",
          textDecoration: "none",
          "&:hover": { color: "#F0544F" },
          fontSize: "11px",
        }}
        href="tel:+1234567890"
      >
        {t("phoneNumber")}
      </Link>
    </Box>
  );
};

export default Contacts;
