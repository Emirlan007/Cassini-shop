import { type FC, useState} from "react";
import toast from "react-hot-toast";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import type {User} from "../../../types";

interface Props {
  user: User;
  onSubmit: (data: { city: string; address: string }) => void;
  loading: boolean;
}

const CheckoutAddressForm: FC<Props> = ({ user, onSubmit, loading }) => {
  const [userData, setUserData] = useState({
    city: user.city ?? "",
    address: user.address ?? "",
  });

  const handleSubmit = () => {
    if (!userData.city || !userData.address) {
      toast.error("Заполните город и адрес");
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

export default CheckoutAddressForm;