import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ThumbNail from "../../../components/UI/ThumbNail/ThumbNail";
import type { Product } from "../../../types";
import { Box } from "@mui/material";
import { API_URL } from "../../../constants";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper.css";
import "swiper/swiper-bundle.css";

interface Props {
  product?: Product;
  selectedColor: string | false;
}

const ProductMediaSlider: React.FC<Props> = ({ product, selectedColor }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0);

  const getCurrentImages = useMemo(() => {
    if (!product?.images || product.images.length === 0) return [];

    if (!selectedColor || !product.imagesByColor?.[selectedColor]) {
      return product.images;
    }

    const imageIndices = product.imagesByColor[selectedColor];
    return imageIndices
      .map((idx) => product.images![idx])
      .filter((img) => img !== undefined);
  }, [product, selectedColor]);

  useEffect(() => {
    setSwiperKey((prev) => prev + 1);
    console.log(swiperKey, "swiper key");
  }, [selectedColor]);

  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "50%" },
      }}
    >
      <Swiper
        key={`swiper-${swiperKey}`}
        modules={[Pagination, Navigation]}
        navigation={false}
        className="mySwiper"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
        {product?.video && !selectedColor && (
          <SwiperSlide key="video">
            <Box sx={{ height: { xs: 320, sm: 400 } }}>
              <video
                width="100%"
                height="100%"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <source src={API_URL + product.video} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </Box>
          </SwiperSlide>
        )}
        {getCurrentImages.map((image) => (
          <SwiperSlide key={image}>
            <Box
              sx={{
                height: { xs: 320, sm: 400 },
              }}
            >
              <img
                src={`${API_URL}${
                  image.startsWith("/") ? image.slice(1) : image
                }`}
                alt={product?.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <ThumbNail
        video={!selectedColor ? product?.video : undefined}
        images={getCurrentImages}
        activeSlide={activeSlide}
        onThumbnailClick={handleThumbnailClick}
      />
    </Box>
  );
};

export default ProductMediaSlider;
