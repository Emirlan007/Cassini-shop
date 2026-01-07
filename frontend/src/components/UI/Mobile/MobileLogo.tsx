import { Link, useNavigate, useLocation } from "react-router-dom";
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
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import NotificationsIcon from "@mui/icons-material/Notifications";
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
import BackButton from "../BackButton.tsx";
import {selectWishlistCount} from "../../../features/wishlist/wishlistSlice.ts";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MobileLogo = () => {
  const location = useLocation();
  const isProductDetailsPage = location.pathname.startsWith("/product/");

  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isSearchOpen = useAppSelector(selectIsSearchOpen);
  const searchProduct = useAppSelector(selectSearchQuery);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const wishlistCount = useAppSelector(selectWishlistCount);

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

  const debouncedSearch = useDebouncedCallback(() => {
    if (searchProduct.length >= 2 || searchProduct.length === 0) {
      dispatch(fetchSearchedProducts(searchProduct));
    }
  }, 500);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
     if (searchProduct.length >= 2 || searchProduct.length === 0) {
      navigate(`/search?q=${encodeURIComponent(searchProduct)}`);
    }
    dispatch(setSearchQuery(value));
    debouncedSearch();
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            backdropFilter: "blur(3.200000047683716px)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            justifyContent: "space-between",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {!isProductDetailsPage && <BackButton />}

            <IconButton sx={{ color: "#d9d9d9" }} onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/newLogo.png" alt="Cassini" style={{ width: "70px" }} />
          </Link>

          <Stack direction="row" spacing={2} alignItems="center">
            <Badge
              badgeContent={wishlistCount}
              max={99}
              color="error"
              onClick={() => navigate("/wishlist")}
              sx={{ cursor: "pointer" }}
            >
              <FavoriteIcon sx={{ color: theme.palette.secondary.light }} />
            </Badge>

            <NotificationsIcon sx={{ color: theme.palette.secondary.light }} />
            <div ref={searchRef}>
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
            </div>
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default MobileLogo;
