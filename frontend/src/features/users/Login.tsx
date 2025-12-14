import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {clearLoginError, selectLoginError, selectLoginLoading} from "./usersSlice";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";
import type {LoginMutation} from "../../types";
import {loginThunk} from "./usersThunks";
import {
  Avatar,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {useTranslation} from "react-i18next";
import { fetchCart } from "../cart/cartThunks";

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [state, setState] = useState<LoginMutation>({
    name: "",
    phoneNumber: "+996",
  });

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  const getFieldError = (field: string) => {
    try {
      return error?.errors?.[field]?.message;
    } catch {
      return undefined;
    }
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState((prevState) => ({...prevState, [name]: value}));
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(loginThunk(state)).unwrap();
      await dispatch(fetchCart());
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
      <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
            mx: "auto",
            px: 2,
          }}
      >
        <Avatar sx={{m: 1, bgcolor: "#F0544F"}}>
          <LockOpenIcon/>
        </Avatar>
        <Typography
            component="h1"
            variant="h5"
            sx={{color: "#660033"}}
        ></Typography>
        {t("login")}
        <Box
            component="form"
            onSubmit={submitFormHandler}
            sx={{
              mt: 3,
              maxWidth: "400px",
              width: "100%",
            }}
        >
          <Stack spacing={2}>
            <TextField
                required
                fullWidth
                label={t("displayName")}
                name="name"
                value={state.name}
                onChange={inputChangeHandler}
                autoComplete="name"
                error={Boolean(getFieldError("name"))}
                helperText={getFieldError("name")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#660033",
                    },
                    "&:hover fieldset": {
                      borderColor: "#F0544F",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#660033",
                  },
                }}
            />
            <TextField
                required
                fullWidth
                type="phoneNumber"
                label={t("phoneNumber")}
                name="phoneNumber"
                value={state.phoneNumber}
                onChange={inputChangeHandler}
                autoComplete="current-password"
                error={Boolean(getFieldError("phoneNumber"))}
                helperText={getFieldError("phoneNumber")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#660033",
                    },
                    "&:hover fieldset": {
                      borderColor: "#F0544F",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#660033",
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
                  bgcolor: "#F0544F",
                  color: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#d14a48",
                  },
                  "&:disabled": {
                    bgcolor: "#cccccc",
                  },
                }}
            >
              {loading ? t("login") + "..." : t("login")}
            </Button>
          </Stack>
        </Box>
        <Link
            component={RouterLink}
            to="/register"
            sx={{
              mt: 2,
              color: "#660033",
              textDecoration: "none",
              "&:hover": {
                color: "#F0544F",
                textDecoration: "underline",
              },
            }}
        >
          У вас ещё нет аккаунта? Зарегистрироваться
        </Link>
      </Box>
  );
};

export default Login;
