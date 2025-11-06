import { Container } from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import HomePage from "./pages/HomePage.tsx";

const App = () => {
  return (
    <>
      <AppToolbar />

      <Container maxWidth="xl" component="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
