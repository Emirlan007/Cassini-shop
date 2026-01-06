import { Outlet } from "react-router-dom";
import { Box, CircularProgress, Container, useMediaQuery } from "@mui/material";
import { Toaster } from "react-hot-toast";
import MobileLogo from "../UI/Mobile/MobileLogo";
import AppToolbar from "../UI/AppToolbar/AppToolbar";
import BottomTouchBar from "../UI/BottomTouchBar/BottomTouchBar";
import Footer from "../Footer/Footer";
import { Suspense } from "react";

const Layout = () => {
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
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress color="secondary" />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </Container>

      {isMobile ? <BottomTouchBar /> : <Footer />}

      <Toaster position="top-center" reverseOrder={false} />
    </Box>
  );
};

export default Layout;
