import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomerInfoProps {
  user: {
    name: string;
    phoneNumber: string;
    city: string;
    address: string;
  };
}

const CustomerInfo = ({ user }: CustomerInfoProps) => {
  const { t } = useTranslation();

  return (
    <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t("customerInfo")}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>{t("name")}:</b> {user.name}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>{t("phoneNumber")}:</b> {user.phoneNumber}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>{t("city")}:</b> {user.city}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>{t("address")}:</b> {user.address}
      </Typography>
    </Box>
  );
};

export default CustomerInfo;
