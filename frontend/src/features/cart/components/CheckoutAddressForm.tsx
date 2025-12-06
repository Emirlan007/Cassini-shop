import {type ChangeEvent, type FC, useState} from "react";
import toast from "react-hot-toast";
import {Box, Button, Stack, TextField, Typography} from "@mui/material";

interface Props {
    onSubmit: (data: {
        city: string;
        address: string;
    }) => void;
    loading: boolean;
}

const CheckoutAddressForm: FC<Props> = ({ onSubmit, loading }) => {
    const [userData, setUserData] = useState({
        city: "",
        address: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if ( !userData.city || !userData.address) {
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
                    label="Город"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#F5F5F5",
                            height: "56px",
                            padding: "0 17px",
                            "& fieldset": {
                                border: "2px solid #F5F5F5",
                            },

                            "&:hover fieldset": {
                                borderColor: "#d8d7d7",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#b3b0b0 !important",
                            }
                        },
                    }}
                />
                <TextField
                    label="Адрес"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#F5F5F5",
                            height: "56px",
                            padding: "0 17px",
                            "& fieldset": {
                                border: "2px solid #F5F5F5",
                            },

                            "&:hover fieldset": {
                                borderColor: "#d8d7d7",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#b3b0b0 !important",
                            }
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    loading={loading}
                    sx={{
                        borderRadius: '14px',
                        fontSize: '16px',
                        fontWeight: '700',
                        padding: '10px 0'
                    }}
                >
                    Далее
                </Button>
            </Stack>
        </Box>
    );
};

export default CheckoutAddressForm;