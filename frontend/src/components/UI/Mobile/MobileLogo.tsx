import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, } from "react";
import { useAppSelector,  } from "../../../app/hooks";
import { selectUser } from "../../../features/users/usersSlice";

import NotificationsIcon from "@mui/icons-material/Notifications";
import theme from "../../../theme.ts";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";

const MobileLogo = () => {
  const user = useAppSelector(selectUser);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (value: boolean) => () => {
    setOpen(value);
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
            <IconButton sx={{ color: "#d9d9d9" }} onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="Cassini" style={{ width: "70px" }} />
          </Link>

          <Stack direction="row" spacing={2} alignItems="center">
            <NotificationsIcon sx={{ color: theme.palette.secondary.light }} />
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default MobileLogo;
