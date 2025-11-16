import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import { selectBanners, selectBannersError } from "./bannersSlice";
import { useEffect } from "react";
import { fetchBanners } from "./bannersThunks";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../constants";
import "swiper/swiper.css";
import "swiper/swiper-bundle.css";
import "./styles.css";

const BannersCarousel = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const bannersError = useAppSelector(selectBannersError);
  const { t } = useTranslation();

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
          }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="mySwiper"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <Box
                  sx={{
                    width: "100%",
                    pr: { xs: "0px", md: "100px" },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { sm: "center", md: "flex-end" },
                    justifyContent: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundImage: `url(${API_URL}${banner.image.startsWith('/') ? banner.image.slice(1) : banner.image})`,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#cccccc4b",
                      borderRadius: 3,
                      p: 2,
                      backdropFilter: "blur(5px)",
                      mx: 1,
                    }}
                  >
                    <Typography variant="h4">{banner.title}</Typography>
                    <Typography variant="h6">{banner.description}</Typography>

                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      to={banner.link ? banner.link : "#"}
                    >
                      <Button
                        variant="contained"
                        sx={{ color: "white", textDecoration: "none" }}
                      >
                        {t("moreInfo")}
                      </Button>
                    </Link>
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