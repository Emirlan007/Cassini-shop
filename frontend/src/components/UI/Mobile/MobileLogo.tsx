import { Link, useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, IconButton, Stack, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import theme from "../../../theme.ts";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";
import { selectWishlistCount } from "../../../features/wishlist/wishlistSlice.ts";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MobileLogo = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wishlistCount = useAppSelector(selectWishlistCount);

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
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default MobileLogo;
