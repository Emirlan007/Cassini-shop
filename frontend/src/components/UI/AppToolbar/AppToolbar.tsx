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
    Collapse,
    TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
    selectLoginLoading,
    selectUser,
} from "../../../features/users/usersSlice";
import { logoutThunk } from "../../../features/users/usersThunks";
import Categories from "../../../features/categories/Categories.tsx";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { selectTotalQuantity } from "../../../features/cart/cartSlice.ts";
import SearchIcon from "@mui/icons-material/Search";
import { useDebouncedCallback } from "use-debounce";
import { fetchSearchedProducts } from "../../../features/products/productsThunks.ts";

const AppToolbar = () => {
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectLoginLoading);
    const totalQuantity = useAppSelector(selectTotalQuantity);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchProduct, setSearchProduct] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen]);

    const debouncedSearch = useDebouncedCallback(() => {
        if (searchProduct.length >= 2 || searchProduct.length === 0) {
            dispatch(fetchSearchedProducts(searchProduct));
        }
    }, 500);

    const toggleDrawer = (value: boolean) => () => setOpen(value);

    const openSearchInput = () => {
        setIsSearchOpen(true);
    };

    const closeSearchInput = () => {
        setIsSearchOpen(false);
        setSearchProduct("");
        dispatch(fetchSearchedProducts(""));
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchProduct(value);
        debouncedSearch();
    };

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
                        <Badge
                            badgeContent={totalQuantity}
                            max={99}
                            color="error"
                            onClick={() => navigate("/cart")}
                            sx={{ cursor: "pointer" }}
                        >
                            <ShoppingCartIcon sx={{ color: "white" }} />
                        </Badge>
                        <Box
                            ref={searchRef}
                            sx={{ display: "flex", alignItems: "center", width: "100%" }}
                        >
                            {isSearchOpen ? (
                                <IconButton onClick={closeSearchInput}>
                                    <CloseIcon sx={{ color: "white" }} />
                                </IconButton>
                            ) : (
                                <IconButton onClick={openSearchInput}>
                                    <SearchIcon sx={{ color: "white" }} />
                                </IconButton>
                            )}

                            <Collapse
                                orientation="horizontal"
                                in={isSearchOpen}
                                sx={{
                                    overflow: "hidden",
                                    display: "flex",
                                    transition: "width 300ms ease, opacity 200ms ease",
                                    width: isSearchOpen ? { xs: "100%", sm: "200px" } : "0px",
                                    opacity: isSearchOpen ? 1 : 0,
                                    ml: 1,
                                }}
                            >
                                <TextField
                                    autoFocus={isSearchOpen}
                                    placeholder="Поиск товаров..."
                                    size="small"
                                    fullWidth
                                    onChange={handleSearchInput}
                                    value={searchProduct}
                                    sx={{
                                        "& fieldset": { border: "none" },
                                        backgroundColor: "white",
                                        borderRadius: "6px",
                                        width: "180px",
                                    }}
                                />
                            </Collapse>
                        </Box>
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
                            Меню
                        </Typography>
                        <IconButton
                            onClick={toggleDrawer(false)}
                            sx={{ color: "primary.main" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        {user ? (
                            <>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 1.5,
                                        mb: 1,
                                    }}
                                >
                                    <AccountCircleIcon />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}
                                    >
                                        {user.displayName}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />

                                <ListItemButton
                                    onClick={() => {
                                        navigate("/account");
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
                                        primary="Личный кабинет"
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItemButton>
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
                                                primary="Добавить товар"
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
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
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
                                            Категории
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
                                        primary="Выйти"
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
                                        primary="Войти"
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
                                        primary="Регистрация"
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItemButton>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ px: 2, py: 1 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
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
                                            Категории
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