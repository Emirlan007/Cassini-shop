import {
    AppBar,
    Box,
    CircularProgress,
    Toolbar,
    IconButton,
    Drawer,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useState, useTransition } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
    selectLoginLoading,
    selectUser,
} from "../../../features/users/usersSlice";
import { logoutThunk } from "../../../features/users/usersThunks";
import Categories from "../../../features/categories/Categories.tsx";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";
import { useTranslation } from "react-i18next";


const AppToolbar = () => {
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectLoginLoading);

    const {t} = useTranslation()
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const toggleDrawer = (value: boolean) => () => setOpen(value);

    const handleLogout = async () => {
        await dispatch(logoutThunk());
        navigate("/login");
    };

    return (
        <>
            <AppBar position="sticky">
                <Toolbar
                    sx={{
                        justifyContent: "space-between",
                        backgroundColor: "secondary.main",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton color="primary" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {isLoading && <CircularProgress color="primary" />}

                    <Stack direction="row" spacing={2} alignItems="center">
                        <LanguageSelect />

                        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                            <img src="/logo.png" alt="Cassini" style={{ width: "70px" }} />
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <Box
                    sx={{
                        width: 280,
                        position: "relative",
                        height: "100%",
                        backgroundColor: "#F7F7F7",
                    }}
                >

                    <Box
                        sx={{
                            backgroundColor: "secondary.main",
                            color: "primary.main",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {t("menu")}
                        </Typography>
                        <IconButton onClick={toggleDrawer(false)} sx={{ color: "primary.main" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        {user ? (
                            <>
                                <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: "0.75rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        }}
                                    >
                                        {t("user")}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <AccountCircleIcon />
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}
                                        >
                                            {user.displayName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {user.role === "admin" && (
                                    <>
                                        <ListItemButton
                                            onClick={() => {
                                                navigate("/products/new");
                                                toggleDrawer(false)();
                                            }}
                                            sx={{
                                                mx: 1,
                                                borderRadius: 1,
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                },
                                            }}
                                        >
                                            <ListItemText
                                                primary={t("addToCart")}
                                                primaryTypographyProps={{
                                                    fontSize: "0.95rem",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </ListItemButton>
                                        <Divider sx={{ my: 1 }} />
                                    </>
                                )}

                                <Box sx={{ px: 2, py: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <CategoryIcon
                                            sx={{ fontSize: "1.2rem", color: "secondary.main" }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "secondary.main",
                                                fontSize: "0.875rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            {t("category")}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ px: 1 }}>
                                    <Categories onCategoryClick={toggleDrawer(false)} />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <ListItemButton
                                    onClick={() => {
                                        handleLogout();
                                        toggleDrawer(false)();
                                    }}
                                    sx={{
                                        mx: 1,
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={t("logout")}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItemButton>
                            </>
                        ) : (
                            <>
                                <ListItemButton
                                    onClick={() => {
                                        navigate("/login");
                                        toggleDrawer(false)();
                                    }}
                                    sx={{
                                        mx: 1,
                                        my: 1,
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={t("login")}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItemButton>

                                <ListItemButton
                                    onClick={() => {
                                        navigate("/register");
                                        toggleDrawer(false)();
                                    }}
                                    sx={{
                                        mx: 1,
                                        mb: 1,
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={t("register")}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItemButton>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ px: 2, py: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <CategoryIcon
                                            sx={{ fontSize: "1.2rem", color: "secondary.main" }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "secondary.main",
                                                fontSize: "0.875rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                                  {t("category")}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ px: 1 }}>
                                    <Categories onCategoryClick={toggleDrawer(false)} />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default AppToolbar;
