import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectLoginLoading,
  selectUser,
} from "../../../features/users/usersSlice";
// import { logoutThunk } from "../../../features/users/usersThunks";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";
import BackButton from "../BackButton.tsx";
import { selectCart } from "../../../features/cart/cartSlice.ts";
import { selectWishlistCount } from "../../../features/wishlist/wishlistSlice.ts";
import { fetchWishlist } from "../../../features/wishlist/wishlistThunks.ts";
import { fetchCart } from "../../../features/cart/cartThunks.ts";
import { useTranslation } from "react-i18next";

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectLoginLoading);
  const totalQuantity = useAppSelector(selectCart)?.totalQuantity;
  const navigate = useNavigate();
  const wishlistCount = useAppSelector(selectWishlistCount);

  const [open, setOpen] = useState(false);

  const { i18n } = useTranslation();

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const currentLang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist({ lang: currentLang }));
    }
    dispatch(fetchCart());
  }, [dispatch, user, currentLang]);

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
            <BackButton />
            <IconButton sx={{ color: "#d9d9d9" }} onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/newLogo.png" alt="Cassini" style={{ width: "70px" }} />
          </Link>

          {isLoading && <CircularProgress color="primary" />}

          <Stack direction="row" spacing={2.5} alignItems="center">
            <LanguageSelect />
            <Badge
              badgeContent={wishlistCount}
              max={99}
              color="error"
              onClick={() => navigate("/wishlist")}
              sx={{ cursor: "pointer" }}
            >
              <FavoriteIcon sx={{ color: "#374151" }} />
            </Badge>

            <Badge
              badgeContent={totalQuantity}
              max={99}
              color="error"
              onClick={() => navigate("/cart")}
              sx={{ cursor: "pointer" }}
            >
              <ShoppingCartIcon sx={{ color: "#374151" }} />
            </Badge>
            <IconButton onClick={() => navigate("/search")}>
              <SearchIcon sx={{ color: "#808080" }} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default AppToolbar;
