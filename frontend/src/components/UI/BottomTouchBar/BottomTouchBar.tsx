import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import theme from "../../../theme";
import { useTranslation } from "react-i18next";

const BottomTouchBar = () => {
  const [selectTouchBar, setSelectTouchBar] = useState("home");
  const {t} = useTranslation()

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
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.search")}
        value="search"
        icon={<SearchIcon />}
      />
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.cart")}
        value="cart"
        icon={<ShoppingCartIcon />}
      />
      <BottomNavigationAction
        sx={{ "&.Mui-selected": { color: theme.palette.secondary.light } }}
        label={t("touchBar.account")}
        value="account"
        icon={<AccountCircleIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomTouchBar;
