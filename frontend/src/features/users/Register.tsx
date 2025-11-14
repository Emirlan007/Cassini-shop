import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import {googleLoginThunk, registerThunk} from './usersThunks';
import type { RegisterMutation } from '../../types';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";

const Register = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectRegisterLoading);
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();

    const [state, setState] = useState<RegisterMutation>({
        displayName: '',
        phoneNumber: '',
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

    const googleRegisterHandler = async (credentialResponse: CredentialResponse) => {
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
                marginTop: 1,
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
            <Box sx={{ mt: 2 }}>
                <GoogleLogin
                    onSuccess={googleRegisterHandler}
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
                                '&:active fieldset': {
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
                        type="phoneNumber"
                        label="Phone Number"
                        name="phoneNumber"
                        value={state.phoneNumber}
                        onChange={inputChangeHandler}
                        autoComplete="new-phoneNumber"
                        error={Boolean(getFieldError('phoneNumber'))}
                        helperText={getFieldError('phoneNumber')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#660033',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#F0544F',
                                },
                                '&:active fieldset': {
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
        </Box>
    );
};

export default Register;