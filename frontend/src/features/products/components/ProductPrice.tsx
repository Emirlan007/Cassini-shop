import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  price: number;
  finalPrice: number;
  showDiscount: boolean;
}

const ProductPrice: React.FC<Props> = ({ price, finalPrice, showDiscount }) => {
  const { t } = useTranslation();

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
            {price} {t("som")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "11.2px",
              color: "#ff4444",
            }}
          >
            {finalPrice} {t("som")}
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
          {price} {t("som")}
        </Typography>
      )}
    </Box>
  );
};

export default ProductPrice;
