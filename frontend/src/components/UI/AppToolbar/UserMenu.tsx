import { useState } from "react";
import type { User } from "../../../types";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../../../features/users/usersThunks";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { API_URL } from "../../../constants";

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const avatarUrl = !user.googleId
    ? API_URL + "images/" + user.avatar
    : user.avatar;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <Box>
      {!isMobile && <Button onClick={handleLogout}>Logout</Button>}

      {isMobile && (
        <>
          <Button
            onClick={handleClick}
            color="inherit"
            sx={{ gap: 2, textTransform: "none" }}
          >
            {user.displayName}
            <Avatar alt={user.displayName} src={avatarUrl} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default UserMenu;
