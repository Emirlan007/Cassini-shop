import { Stack, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

const DocLinks = () => {
  const { t } = useTranslation();

  return (
    <Stack
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
      rowGap={1}
    >
      <Typography
        variant={"h6"}
        component={"h6"}
        sx={{ color: "#1F2937", fontSize: "13px", fontWeight: "bold" }}
      >
        {t("links")}
      </Typography>
      <Link
        href="#"
        sx={{
          color: " #808080",
          textDecoration: "none",
          "&:hover": { color: "#F0544F" },
          fontSize: "11px",
        }}
      >
        {t("aboutUs")}
      </Link>
      <Link
        href="#"
        sx={{
          color: " #808080",
          textDecoration: "none",
          "&:hover": { color: "#F0544F" },
          fontSize: "11px",
        }}
      >
        {t("privacyPolicy")}
      </Link>
      <Link
        href="#"
        sx={{
          color: " #808080",
          textDecoration: "none",
          "&:hover": { color: "#F0544F" },
          fontSize: "11px",
        }}
      >
        {t("termsOfService")}
      </Link>
    </Stack>
  );
};

export default DocLinks;
