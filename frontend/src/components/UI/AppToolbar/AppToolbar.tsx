import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectLoginLoading,
  selectUser,
} from "../../../features/users/usersSlice";
import { logoutThunk } from "../../../features/users/usersThunks";
import Categories from "../../../features/categories/Categories.tsx";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectLoginLoading);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
      <>
          <AppBar position="sticky">
              <Toolbar
                  sx={{
                      justifyContent: "space-between",
                      backgroundColor: "secondary.main",
                  }}
              >
                  <Box display="flex" alignItems="center" gap={1}>
                      <IconButton color="primary" onClick={toggleDrawer(true)}>
                          <MenuIcon />
                      </IconButton>
                  </Box>

                  {isLoading && <CircularProgress color="primary" />}

                  <Stack direction="row" spacing={2}>
                      <LanguageSelect />

                      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                          <img src="/logo.png" alt="Cassini" style={{ width: "70px" }} />
                      </Link>
                  </Stack>
              </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ width: 260, position: "relative", height: "100%" }}>
                  <IconButton
                      onClick={toggleDrawer(false)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                      <CloseIcon />
                  </IconButton>

                  <Box sx={{ mt: 6 }}></Box>

                  <List>
                      {user ? (
                          <>
                              <Box display="flex" alignItems="center" gap={2} px={2} mb={2}>
                                  <Typography variant="subtitle1">
                                      {user.displayName}
                                  </Typography>
                              </Box>

                              {user.role === "admin" && (
                                  <ListItemButton
                                      onClick={() => {
                                          navigate("/addProduct");
                                          toggleDrawer(false)();
                                      }}
                                  >
                                      <ListItemText primary="Add product" />
                                  </ListItemButton>
                              )}

                              <ListItemButton
                                  onClick={() => {
                                      setOpenCategories(true);
                                      toggleDrawer(false)();
                                  }}
                              >
                                  <ListItemText primary="Category" />
                              </ListItemButton>

                              <ListItemButton
                                  onClick={() => {
                                      handleLogout();
                                      toggleDrawer(false)();
                                  }}
                              >
                                  <ListItemText primary="Logout" />
                              </ListItemButton>
                          </>
                      ) : (
                          <>
                              <ListItemButton
                                  onClick={() => {
                                      navigate("/login");
                                      toggleDrawer(false)();
                                  }}
                              >
                                  <ListItemText primary="Sign In" />
                              </ListItemButton>

                              <ListItemButton
                                  onClick={() => {
                                      navigate("/register");
                                      toggleDrawer(false)();
                                  }}
                              >
                                  <ListItemText primary="Sign Up" />
                              </ListItemButton>
                          </>
                      )}
                  </List>
              </Box>
          </Drawer>

          <Drawer
              anchor="left"
              open={openCategories}
              onClose={() => setOpenCategories(false)}
          >
              <Box sx={{ width: 260, position: "relative", height: "100%" }}>
                  <IconButton
                      onClick={() => setOpenCategories(false)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                      <CloseIcon />
                  </IconButton>

                  <Box sx={{ mt: 6, px: 2 }}>
                      <Typography variant="h6" mb={2}>
                          Категории
                      </Typography>
                  </Box>

                  <List>
                      <Categories />
                  </List>
              </Box>
          </Drawer>
      </>
  );
};

export default AppToolbar;