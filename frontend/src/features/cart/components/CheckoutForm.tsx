import {type FC, useState} from "react";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import toast from "react-hot-toast";
import PhoneInput from "./PhoneInput.tsx";

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

  const handleSubmit = () => {
    if (!userData.name || !userData.phoneNumber || !userData.city || !userData.address) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
    onSubmit(userData);
  };

  return (
    <Box>
      <Typography
         sx={{
           fontWeight: '700',
           fontSize: '28px',
           marginBottom: '20px',
           color: '#660033'
         }}
      >
        Личные данные
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Имя"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <PhoneInput
          value={userData.phoneNumber}
          onChange={(value) => setUserData({ ...userData, phoneNumber: value })}
        />
        <TextField
          label="Город"
          value={userData.city}
          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
        />
        <TextField
          label="Адрес"
          value={userData.address}
          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Далее
        </Button>
      </Stack>
    </Box>
  );
};

export default CheckoutForm;
