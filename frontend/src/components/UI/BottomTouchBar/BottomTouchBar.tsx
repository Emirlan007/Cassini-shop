import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import theme from "../../../theme";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../features/users/usersSlice";
import { selectCart } from "../../../features/cart/cartSlice";

const BottomTouchBar = () => {
  const [selectTouchBar, setSelectTouchBar] = useState("home");
  const user = useAppSelector(selectUser);
  const totalQuantity = useAppSelector(selectCart)?.totalQuantity;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectTouchBar(newValue);
  };

  return (
    <BottomNavigation
      sx={{ position: "sticky", bottom: 0, zIndex: 999 }}
      value={selectTouchBar}
      onChange={handleChange}
    >
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        // label={t("touchBar.home")}
        value="home"
        onClick={() => navigate("/")}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.search")}
        value="search"
        onClick={() => navigate("/search")}
        icon={<SearchIcon sx={{ color: "#808080" }} />}
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
          onClick={() => navigate("/account")}
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
