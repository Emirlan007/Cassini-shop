import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks.ts";
import { selectUser } from "./features/users/usersSlice.ts";

import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import Layout from "./components/Layout/Layout.tsx";

const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage.tsx"));
const CategoryProductsPage = lazy(
  () => import("./pages/CategoryProductsPage.tsx")
);
const PageNotFound = lazy(() => import("./pages/PageNotFound.tsx"));

const Register = lazy(() => import("./features/users/Register.tsx"));
const Login = lazy(() => import("./features/users/Login.tsx"));
const ProductDetails = lazy(
  () => import("./features/products/ProductDetails.tsx")
);
const NewProduct = lazy(() => import("./features/products/NewProduct.tsx"));
const AdminProductsList = lazy(
  () => import("./features/products/admin/AdminProductsList.tsx")
);

const UpdateCreateWrap = lazy(
  () => import("./components/UpdateCreateWrap/UpdateCreateWrap.tsx")
);
const Cart = lazy(() => import("./features/cart/Cart.tsx"));
const AdminOrders = lazy(
  () => import("./features/orders/admin/AdminOrders.tsx")
);
const UpdateBanner = lazy(
  () => import("./features/banners/admin/UpdateBanner.tsx")
);
const OrderDetails = lazy(() => import("./features/orders/OrderDetails.tsx"));
const UsersList = lazy(() => import("./features/users/admin/UsersList.tsx"));
const AdminBannersList = lazy(
  () => import("./features/banners/admin/AdminBannersList.tsx")
);
const User = lazy(() => import("./features/users/admin/User.tsx"));
const AdminCategories = lazy(
  () => import("./features/categories/admin/AdminCategories.tsx")
);
const CreateBanner = lazy(
  () => import("./features/banners/admin/CreateBanner.tsx")
);
const Wishlist = lazy(() => import("./features/wishlist/Wishlist.tsx"));
const OrderAnalytics = lazy(
  () => import("./features/analytics/orders/OrderAnalytics.tsx")
);
const ProductAnalytics = lazy(
  () => import("./features/analytics/products/ProductAnalytics.tsx")
);
const PopularSearchKeywords = lazy(
  () => import("./features/analytics/search/PopularSearchKeywords.tsx")
);
const OrderHistoryPage = lazy(
  () => import("./features/OrdersHistory/OrderHistoryPage.tsx")
);
const OrderHistoryDetails = lazy(
  () => import("./features/OrdersHistory/OrderHistoryDetails.tsx")
);

import "./index.css";

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path={"/search"} element={<SearchResultsPage />} />
        <Route
          path="/products/:productUpdate/update"
          element={<UpdateCreateWrap />}
        />
        <Route path="/products/:slug" element={<CategoryProductsPage />} />
        <Route path="/product/:productSlug" element={<ProductDetails />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute isAllowed={user && user.role === "admin"}>
              <NewProduct />
            </ProtectedRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute isAllowed={!!user}>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedRoute isAllowed={!!user}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-history/:historyId"
          element={
            <ProtectedRoute isAllowed={!!user}>
              <OrderHistoryDetails />
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
        />

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
      </Route>
    </Routes>
  );
};

export default App;
