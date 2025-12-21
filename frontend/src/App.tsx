import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import HomePage from "./pages/HomePage.tsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import ProductDetails from "./features/products/ProductDetails.tsx";
import NewProduct from "./features/products/NewProduct.tsx";
import AdminProductsList from "./features/products/admin/AdminProductsList.tsx";
import { Box, Container, useMediaQuery } from "@mui/material";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import { useAppSelector } from "./app/hooks.ts";
import { selectUser } from "./features/users/usersSlice.ts";
import UpdateCreateWrap from "./components/UpdateCreateWrap/UpdateCreateWrap.tsx";
import Cart from "./features/cart/Cart.tsx";
import { Toaster } from "react-hot-toast";
import AccountPage from "./pages/AccountPage.tsx";
import BottomTouchBar from "./components/UI/BottomTouchBar/BottomTouchBar.tsx";
import MobileLogo from "./components/UI/Mobile/MobileLogo.tsx";
import AdminOrders from "./features/orders/admin/AdminOrders.tsx";
import UpdateBanner from "./features/banners/admin/UpdateBanner.tsx";
import OrderDetails from "./features/orders/OrderDetails.tsx";
import UsersList from "./features/users/admin/UsersList.tsx";
import AdminBannersList from "./features/banners/admin/AdminBannersList.tsx";
import User from "./features/users/admin/User.tsx";
import AdminCategories from "./features/categories/admin/AdminCategories.tsx";
import CreateBanner from "./features/banners/admin/CreateBanner.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import SearchResultsPage from "./pages/SearchResultsPage.tsx";
import "./index.css";
import Wishlist from "./features/wishlist/Wishlist.tsx";
import OrderAnalytics from "./features/analytics/orders/OrderAnalytics.tsx";
import ProductAnalytics from "./features/analytics/products/ProductAnalytics.tsx";
import PopularSearchKeywords from "./features/analytics/search/PopularSearchKeywords.tsx";

const App = () => {
  const user = useAppSelector(selectUser);

  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ position: "relative" }}
    >
      {isMobile ? <MobileLogo /> : <AppToolbar />}

      <Container maxWidth="xl" component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path={"/search"} element={<SearchResultsPage />} />
          <Route
            path="/products/:productUpdate/update"
            element={<UpdateCreateWrap />}
          />
          <Route
            path="/products/:categoryId"
            element={<CategoryProductsPage />}
          />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route path={"/addProduct"}></Route>
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute isAllowed={!!user}>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route path="/account" element={<AccountPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <AdminProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <AdminBannersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/admin/banners/new"}
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <CreateBanner />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path={"/admin/banners/:bannerId/update"}
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <UpdateBanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics/orders"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <OrderAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics/products"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <ProductAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics/search-keywords"
            element={
              <ProtectedRoute isAllowed={user && user.role === "admin"}>
                <PopularSearchKeywords />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
      {isMobile ? <BottomTouchBar /> : <Footer />}
      <Toaster position="top-center" reverseOrder={false} />
    </Box>
  );
};

export default App;
