import { Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Stack,
    Collapse,
    TextField,
    Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LanguageIcon from "@mui/icons-material/Language";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import theme from "../../../theme.ts";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";
import { fetchSearchedProducts } from "../../../features/products/productsThunks.ts";
import { useDebouncedCallback } from "use-debounce";
import {
    selectIsSearchOpen,
    selectSearchQuery,
    toggleSearch,
    setSearchQuery,
} from "../../../features/ui/uiSlice.ts";
import { selectWishlistCount } from "../../../features/wishlist/wishlistSlice.ts";
import { useTranslation } from "react-i18next";

const MobileLogo = () => {
    const searchRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const isSearchOpen = useAppSelector(selectIsSearchOpen);
    const searchProduct = useAppSelector(selectSearchQuery);
    const wishlistCount = useAppSelector(selectWishlistCount);

    const [open, setOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const currentLang = i18n.language || "en";
    const languages = [
        { code: "en", label: "EN" },
        { code: "ru", label: "RU" },
        { code: "kg", label: "KG" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                dispatch(toggleSearch(false));
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen, dispatch]);

    const toggleDrawer = (value: boolean) => () => {
        setOpen(value);
    };

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setLangMenuOpen(false);
    };

    const debouncedSearch = useDebouncedCallback(() => {
        if (searchProduct.length >= 2 || searchProduct.length === 0) {
            dispatch(fetchSearchedProducts(searchProduct));
        }
    }, 500);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setSearchQuery(value));

        if (value.length >= 2 || value.length === 0) {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }

        debouncedSearch();
    };

    return (
        <>
            <AppBar position="sticky">
                <Toolbar
                    sx={{
                        backdropFilter: "blur(3.2px)",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        justifyContent: "space-between",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <IconButton sx={{ color: "#d9d9d9" }} onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                        <img src="/newLogo.png" alt="Cassini" style={{ width: "70px" }} />
                    </Link>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Collapse
                            in={!isSearchOpen}
                            orientation="horizontal"
                            timeout={300}
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ position: "relative" }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setLangMenuOpen(!langMenuOpen)}
                                        sx={{
                                            backgroundColor: "transparent",
                                            color: "#660033",
                                            width: 36,
                                            height: 36,
                                            "&:hover": {
                                                backgroundColor: "#d9d9d9",
                                            },
                                        }}
                                    >
                                        <LanguageIcon fontSize="small" />
                                    </IconButton>

                                    {langMenuOpen && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                right: 0,
                                                backgroundColor: "white",
                                                borderRadius: "8px",
                                                border: "1.5px solid #d1d5db",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                zIndex: 1300,
                                                minWidth: "80px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {languages.map(({ code, label }) => (
                                                <Box
                                                    key={code}
                                                    onClick={() => handleLanguageChange(code)}
                                                    sx={{
                                                        padding: "10px 16px",
                                                        cursor: "pointer",
                                                        textAlign: "center",
                                                        fontWeight: currentLang === code ? "bold" : "normal",
                                                        color: currentLang === code ? "#660033" : "#374151",
                                                        backgroundColor: currentLang === code ? "#fef2f2" : "transparent",
                                                        "&:hover": {
                                                            backgroundColor: "#fef2f2",
                                                            color: "#660033",
                                                        },
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    {label}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                <Badge
                                    badgeContent={wishlistCount}
                                    max={99}
                                    color="error"
                                    onClick={() => navigate("/wishlist")}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <FavoriteIcon
                                        sx={{ color: theme.palette.secondary.light }}
                                    />
                                </Badge>
                            </Stack>
                        </Collapse>

                        <div ref={searchRef}>
                            <Collapse
                                orientation="horizontal"
                                in={isSearchOpen}
                                sx={{
                                    overflow: "hidden",
                                    display: "flex",
                                    transition: "width 300ms ease, opacity 200ms ease",
                                    width: isSearchOpen ? "180px" : "0px",
                                    opacity: isSearchOpen ? 1 : 0,
                                    ml: 1,
                                }}
                            >
                                <TextField
                                    autoFocus
                                    placeholder="Поиск товаров..."
                                    size="small"
                                    value={searchProduct}
                                    onChange={handleSearchInput}
                                    sx={{
                                        "& fieldset": { border: "none" },
                                        backgroundColor: "white",
                                        borderRadius: "6px",
                                    }}
                                />
                            </Collapse>
                        </div>
                    </Stack>
                </Toolbar>
            </AppBar>

            <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
        </>
    );
};

export default MobileLogo;