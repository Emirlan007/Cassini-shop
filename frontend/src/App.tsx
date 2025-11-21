import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import {Route, Routes, useLocation} from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import HomePage from "./pages/HomePage.tsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import ProductDetails from "./features/products/ProductDetails.tsx";
import NewProduct from "./features/products/NewProduct.tsx";
import {Box, Container, useMediaQuery} from "@mui/material";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";
import UpdateCreateWrap from "./components/UpdateCreateWrap/UpdateCreateWrap.tsx";
import Cart from "./features/cart/Cart.tsx";
import {Toaster} from "react-hot-toast";
import AccountPage from "./pages/AccountPage.tsx";

const App = () => {
    const user = useAppSelector(selectUser);
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const hideFooter = isMobile && location.pathname.startsWith('/product/');
  
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <AppToolbar/>

            <Container maxWidth="xl" component="main" sx={{flex: 1, py: 4}}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/products/:productUpdate/update" element={<UpdateCreateWrap/>}/>
                     <Route path="/products/:categoryId" element={<CategoryProductsPage />} />
                    <Route path="/product/:productId" element={<ProductDetails/>}/>
                    <Route
                        path="/products/new"
                        element={
                            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
                                <NewProduct/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path={"/addProduct"}></Route>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Container>
            <Footer/>
            <Toaster position="top-center" reverseOrder={false} />t
        </Box>
    );
};

export default App;
