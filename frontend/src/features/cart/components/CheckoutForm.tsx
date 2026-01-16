import { type FC, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import PhoneInput from "./PhoneInput.tsx";
import { useTranslation } from "react-i18next";

interface CheckoutFormProps {
  onSubmit: (data: {
    name: string;
    phoneNumber: string;
    city: string;
    address: string;
  }) => void;
  loading: boolean;
}

const CheckoutForm: FC<CheckoutFormProps> = ({ onSubmit, loading }) => {
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "+996",
    city: "",
    address: "",
  });

  const { t } = useTranslation();

  const handleSubmit = () => {
    if (
      !userData.name ||
      !userData.phoneNumber ||
      !userData.city ||
      !userData.address
    ) {
      toast.error(t("fillInAllFields"));
      return;
    }
    onSubmit(userData);
  };

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "700",
          fontSize: "28px",
          marginBottom: "20px",
          color: "#660033",
        }}
      >
        {t("personalData")}
      </Typography>
      <Stack data-testid="checkout-form" spacing={2}>
        <TextField
          label={t("name")}
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <PhoneInput
          value={userData.phoneNumber}
          onChange={(value) => setUserData({ ...userData, phoneNumber: value })}
        />
        <TextField
          label={t("city")}
          value={userData.city}
          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
        />
        <TextField
          label={t("address")}
          value={userData.address}
          onChange={(e) =>
            setUserData({ ...userData, address: e.target.value })
          }
        />

        <Button
          data-testid="checkout-submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {t("next")}
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckoutForm;
