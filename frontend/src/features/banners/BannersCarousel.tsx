import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Alert, Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {Link} from "react-router-dom";
import { selectBanners, selectBannersError } from "./bannersSlice";
import { useEffect } from "react";
import { fetchBanners } from "./bannersThunks";
import { API_URL } from "../../constants";
import "swiper/swiper.css";
import "swiper/swiper-bundle.css";
import "./styles.css";

const BannersCarousel = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const bannersError = useAppSelector(selectBannersError);
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <>
      {bannersError ? (
        <Alert severity="error">{bannersError}</Alert>
      ) : (
        <Box
          sx={{
            width: "100%",
            maxWidth: { lg: "1200px", md: "800px", sm: "600px", xs: "320px" },
            mx: "auto",
            mt: 1,
            mb: 3,
            py:{xs: 'none', md: 5},
            bgcolor:  "rgba(102, 0, 51, 0.05)",
          }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            // autoplay={{ delay: 3000 }}
            loop={true}
            className="mySwiper"
            style={{minHeight: "550px",}}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                  <Box
                      component={Link}
                      to={banner.link ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        textDecoration: "none",
                        msxWidth: "100%",
                        width: '1200px',
                        pr: { xs: "0px", md: "12.8px" },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "center", sm: "flex-end" },
                        justifyContent: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "left",
                        backgroundSize: "contain",
                        ml: {md: 3},
                        backgroundImage: `url(${API_URL}${banner.image.replace('public/', '')})`,
                        transition: "transform 0.35s ease, box-shadow 0.35s ease",
                        "&:hover": {
                          transform: "scale(1.01)",
                        }
                      }}

                  >
                    <Box
                        sx={{
                          ml: "auto",
                          borderRadius: 3,
                          mt: {xs: "auto", md: "0px"},
                          p: 2,
                          maxWidth: 320,
                          mx: 1,
                        }}
                    >
                      <Typography sx={{
                        fontWeight: {xs: 700, md: 800 },
                        fontSize: "36px",
                        lineHeight: "133%",
                        letterSpacing: "-0.04em",
                        textAlign: {xs: "left", md: "center"},
                        color: {xs: "#fff", sm: "#111827"},
                        mb: "6.4px",
                      }} variant="h4">{banner.title}</Typography>

                      <Typography sx={{
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "150%",
                        mb: "25px",
                        textAlign: {xs: "left", md: "center"},
                        color: {xs: "#fff", sm: "#374151"},
                      }} variant="h6">{banner.description}</Typography>
                    </Box>
                  </Box>

              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </>
  );
};

export default BannersCarousel;