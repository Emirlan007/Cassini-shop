import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/getImageUrl";

interface Props {
  images: string[];
  name: string;
}

const ProductImageSlider: React.FC<Props> = ({ images, name }: Props) => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [hovered, images]);

  const MotionCardMedia = motion("img");

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setIndex(0);
      }}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "180px", sm: "240px", md: "320px", lg: "448px" },
      }}
    >
      <AnimatePresence mode="wait">
        <MotionCardMedia
          key={index}
          src={getImageUrl(images[index])}
          alt={name}
          initial={index === 0 ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>
    </Box>
  );
};

export default ProductImageSlider;
