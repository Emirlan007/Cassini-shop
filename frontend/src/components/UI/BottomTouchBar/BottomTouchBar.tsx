import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import theme from "../../../theme";
import { useTranslation } from "react-i18next";
import { selectTotalQuantity } from "../../../features/cart/cartSlice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../features/users/usersSlice";
import { selectIsSearchOpen, toggleSearch } from "../../../features/ui/uiSlice";
import CloseIcon from "@mui/icons-material/Close";

const BottomTouchBar = () => {
  const [selectTouchBar, setSelectTouchBar] = useState("home");
  const user = useAppSelector(selectUser);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isSearchOpen = useAppSelector(selectIsSearchOpen);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectTouchBar(newValue);
  };

  return (
    <BottomNavigation
      sx={{ position: "sticky", bottom: 1 }}
      value={selectTouchBar}
      onChange={handleChange}
    >
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.home")}
        value="home"
        onClick={() => navigate("/")}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.search")}
        value="search"
        onClick={() => dispatch(toggleSearch(true))}
        icon={
          isSearchOpen ? (
            <IconButton onClick={() => dispatch(toggleSearch(false))}>
              <CloseIcon sx={{ color: "#808080" }} />
            </IconButton>
          ) : (
            <IconButton onClick={() => dispatch(toggleSearch(true))}>
              <SearchIcon sx={{ color: "#808080" }} />
            </IconButton>
          )
        }
      />

      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.cart")}
        value="cart"
        icon={
          <Badge
            badgeContent={totalQuantity}
            max={99}
            color="error"
            onClick={() => navigate("/cart")}
            sx={{ cursor: "pointer" }}
          >
            <ShoppingCartIcon sx={{ color: "#374151" }} />
          </Badge>
        }
      />
      {user ? (
        <BottomNavigationAction
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
          label={t("touchBar.account")}
          value="account"
          icon={<AccountCircleIcon />}
          onClick={() => navigate("/userPage")}
        />
      ) : (
        <BottomNavigationAction
          sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
          label={t("touchBar.account")}
          value="account"
          icon={<AccountCircleIcon />}
          onClick={() => navigate("/login")}
        />
      )}
    </BottomNavigation>
  );
};

export default BottomTouchBar;
