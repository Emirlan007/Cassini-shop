import {
  Box,
  IconButton,
  Drawer,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectUser } from "../../../features/users/usersSlice";
import { logoutThunk } from "../../../features/users/usersThunks";
import Categories from "../../../features/categories/Categories.tsx";
import { clearCart } from "../../../features/cart/cartSlice.ts";

interface Props {
  isOpen: boolean;
  toggleDrawer(value: boolean): () => void;
}

const CustomDrawer: React.FC<Props> = ({ isOpen, toggleDrawer }) => {
  const user = useAppSelector(selectUser);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 280,
          position: "relative",
          height: "100%",
          backgroundColor: "#F7F7F7",
        }}
      >
        <Box
          sx={{
            backgroundColor: "secondary.main",
            color: "primary.main",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Меню
          </Typography>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ color: "primary.main" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          {user ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  mb: 1,
                }}
              >
                <AccountCircleIcon />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "text.primary", mt: 0.5 }}
                >
                  {user.name}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <ListItemButton
                onClick={() => {
                  navigate("/account");
                  toggleDrawer(false)();
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary="Личный кабинет"
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
              <Divider sx={{ my: 1 }} />

              {user.role === "admin" && (
                <>
                  {/*<ListItemButton*/}
                  {/*  onClick={() => {*/}
                  {/*    navigate("/products/new");*/}
                  {/*    toggleDrawer(false)();*/}
                  {/*  }}*/}
                  {/*  sx={{*/}
                  {/*    mx: 1,*/}
                  {/*    borderRadius: 1,*/}
                  {/*    "&:hover": {*/}
                  {/*      backgroundColor: "action.hover",*/}
                  {/*    },*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <ListItemText*/}
                  {/*    primary="Добавить товар"*/}
                  {/*    primaryTypographyProps={{*/}
                  {/*      fontSize: "0.95rem",*/}
                  {/*      fontWeight: 500,*/}
                  {/*    }}*/}
                  {/*  />*/}
                  {/*</ListItemButton>*/}
                  {/*<Divider sx={{ my: 1 }} />*/}

                  <ListItemButton
                    onClick={() => {
                      navigate("/admin");
                      toggleDrawer(false)();
                    }}
                    sx={{
                      mx: 1,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary="Админ панель"
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                  <Divider sx={{ my: 1 }} />
                  {/*<ListItemButton*/}
                  {/*    onClick={() => {*/}
                  {/*      navigate("/admin/banners/new");*/}
                  {/*      toggleDrawer(false)();*/}
                  {/*    }}*/}
                  {/*    sx={{*/}
                  {/*      mx: 1,*/}
                  {/*      borderRadius: 1,*/}
                  {/*      "&:hover": {*/}
                  {/*        backgroundColor: "action.hover",*/}
                  {/*      },*/}
                  {/*    }}*/}
                  {/*>*/}
                  {/*  <ListItemText*/}
                  {/*      primary="Добавить баннер"*/}
                  {/*      primaryTypographyProps={{*/}
                  {/*        fontSize: "0.95rem",*/}
                  {/*        fontWeight: 500,*/}
                  {/*      }}*/}
                  {/*  />*/}
                  {/*</ListItemButton>*/}
                  {/*<Divider sx={{ my: 1 }} />*/}
                  {/*<ListItemButton*/}
                  {/*  onClick={() => {*/}
                  {/*    navigate("/admin/orders");*/}
                  {/*    toggleDrawer(false)();*/}
                  {/*  }}*/}
                  {/*  sx={{*/}
                  {/*    mx: 1,*/}
                  {/*    borderRadius: 1,*/}
                  {/*    "&:hover": {*/}
                  {/*      backgroundColor: "action.hover",*/}
                  {/*    },*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <ListItemText*/}
                  {/*    primary="Заказы"*/}
                  {/*    primaryTypographyProps={{*/}
                  {/*      fontSize: "0.95rem",*/}
                  {/*      fontWeight: 500,*/}
                  {/*    }}*/}
                  {/*  />*/}
                  {/*</ListItemButton>*/}
                  {/*<Divider sx={{ my: 1 }} />*/}
                </>
              )}

              <Box sx={{ px: 2, py: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CategoryIcon
                    sx={{ fontSize: "1.2rem", color: "secondary.main" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "secondary.main",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Категории
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 1 }}>
                <Categories onCategoryClick={toggleDrawer(false)} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <ListItemButton
                onClick={() => {
                  handleLogout();
                  toggleDrawer(false)();
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary="Выйти"
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </>
          ) : (
            <>
              {!isMobile && (
                <ListItemButton
                  onClick={() => {
                    navigate("/login");
                    toggleDrawer(false)();
                  }}
                  sx={{
                    mx: 1,
                    my: 1,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary="Войти"
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              )}

              {!isMobile && (
                <ListItemButton
                  onClick={() => {
                    navigate("/register");
                    toggleDrawer(false)();
                  }}
                  sx={{
                    mx: 1,
                    mb: 1,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary="Регистрация"
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ px: 2, py: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CategoryIcon
                    sx={{ fontSize: "1.2rem", color: "secondary.main" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "secondary.main",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Категории
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ px: 1 }}>
                <Categories onCategoryClick={toggleDrawer(false)} />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
