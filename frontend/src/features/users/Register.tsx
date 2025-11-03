import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import { registerThunk } from './usersThunks';
import type { RegisterMutation } from '../../types';

const Register = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectRegisterLoading);
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();

    const [state, setState] = useState<RegisterMutation>({
        email: '',
        displayName: '',
        password: '',
    });

    const getFieldError = (fieldName: string) => {
        try {
            return error?.errors[fieldName]?.message;
        } catch {
            return undefined;
        }
    };

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(registerThunk(state)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box
            sx={{
                marginTop: { xs: 4, sm: 8 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 400,
                width: '100%',
                mx: 'auto',
                px: 2
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: '#F0544F' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography
                component="h1"
                variant="h5"
                sx={{ color: '#660033' }}
            >
                Создать аккаунт
            </Typography>
            <Box
                component="form"
                onSubmit={submitFormHandler}
                sx={{
                    mt: 3,
                    maxWidth: '400px',
                    width: '100%'
                }}
            >
                <Stack spacing={2}>
                    <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        value={state.email}
                        onChange={inputChangeHandler}
                        autoComplete="email"
                        error={Boolean(getFieldError('email'))}
                        helperText={getFieldError('email')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#660033',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#F0544F',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#660033',
                            },
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Display name"
                        name="displayName"
                        value={state.displayName}
                        onChange={inputChangeHandler}
                        autoComplete="name"
                        error={Boolean(getFieldError('displayName'))}
                        helperText={getFieldError('displayName')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#660033',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#F0544F',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#660033',
                            },
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        type="password"
                        label="Password"
                        name="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                        autoComplete="new-password"
                        error={Boolean(getFieldError('password'))}
                        helperText={getFieldError('password')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#660033',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#F0544F',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#660033',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 2,
                            bgcolor: '#F0544F',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#d14a48',
                            },
                            '&:disabled': {
                                bgcolor: '#cccccc',
                            },
                        }}
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                </Stack>
            </Box>
            <Link
                component={RouterLink}
                to="/login"
                sx={{
                    mt: 2,
                    color: '#660033',
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#F0544F',
                        textDecoration: 'underline',
                    },
                }}
            >
                У вас уже есть аккаунт? Войти
            </Link>
        </Box>
    );
};

export default Register;