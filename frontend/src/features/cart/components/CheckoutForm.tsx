import {type FC, useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import toast from "react-hot-toast";

interface CheckoutFormProps {
    onSubmit: (data: { name: string, number: string, city: string, address: string }) => void;
}

const CheckoutForm: FC<CheckoutFormProps> = ({onSubmit}) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!name || !number || !city || !address) {
            toast.error("Пожалуйста, заполните все поля");
            return;
        }
        onSubmit({name, number, city, address});
    };

    return (
        <Box p={2} border="1px solid #ccc" borderRadius={2} bgcolor="background.paper">
            <Stack spacing={2}>
                <TextField label="Имя" value={name} onChange={(e) => setName(e.target.value)} fullWidth/>
                <TextField label="Номер" value={number} onChange={(e) => setNumber(e.target.value)} fullWidth/>
                <TextField label="Город" value={city} onChange={(e) => setCity(e.target.value)} fullWidth/>
                <TextField label="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth/>
                <TextField
                    label="Комментарий к заказу"
                    multiline
                    rows={4}
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Добавьте комментарий..."
                />

                <Button variant="contained" onClick={handleSubmit}>Далее</Button>
            </Stack>
        </Box>
    );
};

export default CheckoutForm;
