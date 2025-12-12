import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectLoginLoading } from "../../../features/users/usersSlice";
// import { logoutThunk } from "../../../features/users/usersThunks";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";
import BackButton from "../BackButton.tsx";
import SearchInput from "../SearchInput/SearchInput.tsx";
import { selectCart } from "../../../features/cart/cartSlice.ts";

const AppToolbar = () => {
  
  const isLoading = useAppSelector(selectLoginLoading);
  const totalQuantity = useAppSelector(selectCart)?.totalQuantity;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toggleDrawer = (value: boolean) => () => setOpen(value);
 

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

          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageSelect />
            <Badge
              badgeContent={totalQuantity}
              max={99}
              color="error"
              onClick={() => navigate("/cart")}
              sx={{ cursor: "pointer" }}
            >
              <ShoppingCartIcon sx={{ color: "#374151" }} />
            </Badge>
            <SearchInput />
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default AppToolbar;
