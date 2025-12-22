import { Box, Typography } from "@mui/material";

interface Props {
  price: number;
  finalPrice: number;
  showDiscount: boolean;
}

const ProductPrice: React.FC<Props> = ({ price, finalPrice, showDiscount }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {showDiscount ? (
        <>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "11.2px",
              color: "#4B5563",
              textDecoration: "line-through",
            }}
          >
            {price} сом
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "11.2px",
              color: "#ff4444",
            }}
          >
            {finalPrice} сом
          </Typography>
        </>
      ) : (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "11.2px",
            color: "#4B5563",
          }}
        >
          {price} сом
        </Typography>
      )}
    </Box>
  );
};

export default ProductPrice;
