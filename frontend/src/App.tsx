import { Box, Container } from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import HomePage from "./pages/HomePage.tsx";
import Footer from "./components/Footer/Footer.tsx";
import ProductDetails from "./features/products/ProductDetails.tsx";

const App = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppToolbar />

      <Container maxWidth="xl" component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path={'/addProduct'}></Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>

      <Footer />
    </Box>
  );
};

export default App;
