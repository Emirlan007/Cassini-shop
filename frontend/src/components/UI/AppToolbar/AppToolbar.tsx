import { AppBar, Box, CircularProgress, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import {
  selectLoginLoading,
  selectUser,
} from "../../../features/users/usersSlice";
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectLoginLoading);

  let menu = <AnonymousMenu />;

  if (user) {
    menu = <UserMenu user={user} />;
  }

  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          backgroundColor: "secondary.main",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            display: "flex",
            gap: 1,
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="Cassini"
              style={{ height: 50, cursor: "pointer" }}
            />
          </Link>

          {isLoading ? <CircularProgress color="inherit" /> : menu}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
