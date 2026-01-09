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
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
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

const MobileLogo = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSearchOpen = useAppSelector(selectIsSearchOpen);
  const searchProduct = useAppSelector(selectSearchQuery);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const [open, setOpen] = useState(false);

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

                  <NotificationsIcon
                      sx={{ color: theme.palette.secondary.light }}
                  />
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
