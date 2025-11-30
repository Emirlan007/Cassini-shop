import { type FC, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import toast from "react-hot-toast";

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
    phoneNumber: "",
    city: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !userData.name ||
      !userData.phoneNumber ||
      !userData.city ||
      !userData.address
    ) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    onSubmit(userData);
  };

  return (
    <Box
      p={2}
      border="1px solid #ccc"
      borderRadius={2}
      bgcolor="background.paper"
    >
      <Stack spacing={2}>
        <TextField
          label="Имя"
          name="name"
          value={userData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Номер"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Город"
          name="city"
          value={userData.city}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Адрес"
          name="address"
          value={userData.address}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit} loading={loading}>
          Далее
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckoutForm;
