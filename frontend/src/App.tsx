import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import {Route, Routes} from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import HomePage from "./pages/HomePage.tsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import ProductDetails from "./features/products/ProductDetails.tsx";
import NewProduct from "./features/products/NewProduct.tsx";
import {Box, Container} from "@mui/material";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";
import UpdateCreateWrap from "./components/UpdateCreateWrap/UpdateCreateWrap.tsx";

const App = () => {
    const user = useAppSelector(selectUser);
  
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
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Container>
            <Footer/>
        </Box>
    );
};

export default App;
