import { Avatar, Box } from "@mui/material";
import type { Product } from "../../../types";
import { API_URL } from "../../../constants";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

interface Props {
  product: Product;
  activeSlide: number;
}

const ThumbNail: React.FC<Props> = ({ product, activeSlide }) => {
  const hasVideo = !!product.video;

  return (
    <Box
      component="div"
      sx={{
        position: "absolute",
        zIndex: 50,
        top: 1,
        left: 1,
        display: "flex",
        flexDirection: "column",
    
      }}
    >
      {hasVideo && (
        <Box
          sx={{
            position: "relative",
            width: 40,
            height: 40,
          }}
        >
          <video
            width="40"
            height="40"
            style={{
              objectFit: "cover",
              borderRadius: "4px",
              opacity: activeSlide === 0 ? 1 : 0.5,
              transition: "opacity 0.3s ease-in-out",
              cursor: "pointer",
              background: "white",
            }}
          >
            <source src={API_URL + product.video} type="video/mp4" />
          </video>
          <PlayCircleOutlineIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: 20,
              pointerEvents: "none",
            }}
          />
        </Box>
      )}
      {product.images?.map((item, index) => {
        const imageIndex = hasVideo ? index + 1 : index;
        const isActive = activeSlide === imageIndex;
        return (
          <div key={index}>
            <Avatar
              variant="square"
              sizes="lg"
              alt="Remy Sharp"
              src={API_URL + item}
              sx={{
                background: "white",
                opacity: isActive ? 1 : 0.5,
                transition: "opacity 0.3s ease-in-out",
                cursor: "pointer",
              }}
            />
          </div>
        );
      })}
    </Box>
  );
};

export default ThumbNail;
