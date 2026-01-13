import { Box, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslation } from "react-i18next";

const SocialLinks = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" gap={2} flexDirection={"column"} alignItems={"center"}>
      <Typography
        sx={{ color: "#1F2937", fontWeight: "bold", fontSize: "13px" }}
        variant="h6"
        component="h6"
      >
        {t("followUs")}
      </Typography>
      <Box display={"flex"} gap={2}>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon
            sx={{ color: "#808080", "&:hover": { color: "#F0544F" } }}
          />
        </a>

        <a
          href="https://web.telegram.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon
            sx={{ color: "#808080", "&:hover": { color: "#F0544F" } }}
          />
        </a>

        <a
          href="https://www.whatsapp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon
            sx={{ color: "#808080", "&:hover": { color: "#F0544F" } }}
          />
        </a>
      </Box>
    </Box>
  );
};

export default SocialLinks;
