import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  IconButton,
  Stack,
  Collapse,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectLoginLoading } from "../../../features/users/usersSlice";
// import { logoutThunk } from "../../../features/users/usersThunks";
import LanguageSelect from "../LanguageSelect/LanguageSelect.tsx";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { selectTotalQuantity } from "../../../features/cart/cartSlice.ts";
import SearchIcon from "@mui/icons-material/Search";
import { useDebouncedCallback } from "use-debounce";
import { fetchSearchedProducts } from "../../../features/products/productsThunks.ts";
import CustomDrawer from "../CustomDrawer/CustomDrawer.tsx";

const AppToolbar = () => {
  // const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectLoginLoading);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const debouncedSearch = useDebouncedCallback(() => {
    if (searchProduct.length >= 2 || searchProduct.length === 0) {
      dispatch(fetchSearchedProducts(searchProduct));
    }
  }, 500);

  const toggleDrawer = (value: boolean) => () => setOpen(value);

  const openSearchInput = () => {
    setIsSearchOpen(true);
  };

  const closeSearchInput = () => {
    setIsSearchOpen(false);
    setSearchProduct("");
    dispatch(fetchSearchedProducts(""));
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchProduct(value);
    debouncedSearch();
  };
  //
  // const handleLogout = async () => {
  //   await dispatch(logoutThunk());
  //   navigate("/login");
  // };

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
            <Box
              ref={searchRef}
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              {isSearchOpen ? (
                <IconButton onClick={closeSearchInput}>
                  <CloseIcon sx={{ color: "#808080" }} />
                </IconButton>
              ) : (
                <IconButton onClick={openSearchInput}>
                  <SearchIcon sx={{ color: "#808080" }} />
                </IconButton>
              )}

              <Collapse
                orientation="horizontal"
                in={isSearchOpen}
                sx={{
                  overflow: "hidden",
                  display: "flex",
                  transition: "width 300ms ease, opacity 200ms ease",
                  width: isSearchOpen ? { xs: "100%", sm: "200px" } : "0px",
                  opacity: isSearchOpen ? 1 : 0,
                  ml: 1,
                }}
              >
                <TextField
                  autoFocus={isSearchOpen}
                  placeholder="Поиск товаров..."
                  size="small"
                  fullWidth
                  onChange={handleSearchInput}
                  value={searchProduct}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: "white",
                    borderRadius: "6px",
                    width: "180px",
                  }}
                />
              </Collapse>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <CustomDrawer isOpen={open} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default AppToolbar;
