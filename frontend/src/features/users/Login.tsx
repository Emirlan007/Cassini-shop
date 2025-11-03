import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import type { LoginMutation } from '../../types';
import { googleLoginThunk, loginThunk } from './usersThunks';
import { Alert, Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const loading = useAppSelector(selectLoginLoading);
    const navigate = useNavigate();

    const [state, setState] = useState<LoginMutation>({
        email: '',
        password: '',
    });

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(loginThunk(state)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    };

    const googleLoginHandler = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                await dispatch(googleLoginThunk(credentialResponse.credential)).unwrap();
                navigate('/');
            } catch (e) {
                console.log(e);
            }
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
                <LockOpenIcon />
            </Avatar>
            <Typography
                component="h1"
                variant="h5"
                sx={{ color: '#660033' }}
            >
                Войти
            </Typography>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mt: 3,
                        width: '100%',
                        '& .MuiAlert-message': {
                            color: '#660033',
                        }
                    }}
                >
                    {error.error}
                </Alert>
            )}

            <Box sx={{ mt: 2, width: '100%' }}>
                <GoogleLogin
                    onSuccess={googleLoginHandler}
                    onError={() => {
                        console.log('Google Login Failed');
                    }}
                    useOneTap
                    width="100%"
                />
            </Box>

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
                        autoComplete="current-password"
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
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>
                </Stack>
            </Box>
            <Link
                component={RouterLink}
                to="/register"
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
                У вас ещё нет аккаунта? Зарегистрироваться
            </Link>
        </Box>
    );
};

export default Login;