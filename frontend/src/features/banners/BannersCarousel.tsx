import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Alert, Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBanners, selectBannersError } from "./bannersSlice";
import { useEffect } from "react";
import { fetchBanners } from "./bannersThunks";
import { API_URL } from "../../constants";
import { useTranslation } from "react-i18next";
import "swiper/swiper.css";
import "swiper/swiper-bundle.css";
import "./styles.css";

const BannersCarousel = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);
  const bannersError = useAppSelector(selectBannersError);
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      const lang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";
      dispatch(fetchBanners({ lang }));
    };

    i18n.on("languageChanged", handleLanguageChange);
    handleLanguageChange();

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [dispatch, i18n]);

  const getBannerText = (
      field: string | { ru: string; en?: string; kg?: string } | undefined,
      defaultValue: string = ""
  ): string => {
    if (!field) return defaultValue;
    if (typeof field === "string") return field;

    const lang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";
    return field[lang] || field.ru || defaultValue;
  };

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
                  py: { xs: "none", md: 5 },
                  background:
                      "linear-gradient(90deg, rgba(102, 0, 51, 0.05), rgb(255, 255, 255))",
                }}
            >
              <Swiper
                  modules={[Pagination, Autoplay]}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                  className="mySwiper"
                  style={{ minHeight: "550px" }}
              >
                {banners.map((banner) => {
                  const title = getBannerText(banner.title);
                  const description = getBannerText(banner.description);

                  return (
                      <SwiperSlide key={banner._id}>
                        <Box
                            rel="noopener noreferrer"
                            sx={{
                              textDecoration: "none",
                              msxWidth: "100%",
                              width: "1200px",
                              pr: { xs: "0px", md: "12.8px" },
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: { xs: "center", sm: "flex-end" },
                              justifyContent: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "left",
                              backgroundSize: "contain",
                              ml: { md: 3 },
                              backgroundImage: `url(${API_URL}${banner.image.replace(
                                  "public/",
                                  ""
                              )})`,
                              transition: "transform 0.35s ease, box-shadow 0.35s ease",
                              "&:hover": {
                                transform: "scale(1.01)",
                              },
                            }}
                        >
                          <Box
                              sx={{
                                ml: "auto",
                                borderRadius: 3,
                                mt: { xs: "auto", md: "0px" },
                                p: 2,
                                maxWidth: 320,
                                mx: 1,
                              }}
                          >
                            <Typography
                                sx={{
                                  fontWeight: { xs: 700, md: 800 },
                                  fontSize: "36px",
                                  lineHeight: "133%",
                                  letterSpacing: "-0.04em",
                                  textAlign: { xs: "left", md: "center" },
                                  color: { xs: "#fff", sm: "#111827" },
                                  mb: "6.4px",
                                }}
                                variant="h4"
                            >
                              {title}
                            </Typography>

                            {description && (
                                <Typography
                                    sx={{
                                      fontWeight: 400,
                                      fontSize: "12px",
                                      lineHeight: "150%",
                                      mb: "25px",
                                      textAlign: { xs: "left", md: "center" },
                                      color: { xs: "#fff", sm: "#374151" },
                                    }}
                                    variant="h6"
                                >
                                  {description}
                                </Typography>
                            )}
                          </Box>
                        </Box>
                      </SwiperSlide>
                  );
                })}
              </Swiper>
            </Box>
        )}
      </>
  );
};

export default BannersCarousel;