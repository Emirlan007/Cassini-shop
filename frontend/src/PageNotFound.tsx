import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const {t}= useTranslation()
  return (
    <Typography variant="h1" textAlign="center" mt={10}>
      {t("pageNotFound")}
    </Typography>
  );
};

export default PageNotFound;
