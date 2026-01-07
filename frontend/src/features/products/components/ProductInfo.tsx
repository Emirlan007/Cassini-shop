import { Box, Stack, Typography } from "@mui/material";
import type { Product } from "../../../types";
import type React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  product: Product;
  finalPrice: number;
  showDiscount: boolean;
  timeLeft: string;
}

const ProductInfo: React.FC<Props> = ({
  product,
  finalPrice,
  showDiscount,
  timeLeft,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            <b>{product?.name}</b>
          </Typography>

          {product?.isNew && (
            <Box
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {t("new")}
            </Box>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          {showDiscount ? (
            <>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#4B5563",
                  textDecoration: "line-through",
                }}
              >
                {product.price} {t("som")}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#ff4444",
                }}
              >
                {finalPrice} {t("som")}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "18px", sm: "24px" },
                color: "#660033",
              }}
            >
              {product.price} {t("som")}
            </Typography>
          )}

          {showDiscount && (
            <Typography
              sx={{
                backgroundColor: "#ff4444",
                color: "white",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              -{product.discount}%
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "block",
            marginLeft: { xs: 0, sm: "auto" },
          }}
        >
          {showDiscount && timeLeft && (
            <Typography
              sx={{
                color: "red",
                padding: "4px 8px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {t("timeLeft")}: {timeLeft}
            </Typography>
          )}
        </Box>
      </Box>

      {product?.inStock && (
        <Typography
          sx={{
            color: "green",
            display: "block",
            mt: 1,
            fontWeight: 600,
          }}
        >
          {t("inStock")}
        </Typography>
      )}

      {product.material && (
        <Box mt={3}>
          <Typography
            sx={{
              color: "#525252",
              fontSize: "14px",
              fontWeight: "400",
              mb: 1,
            }}
          >
            {t("material")}:{" "}
            <strong style={{ color: "#333" }}>{product.material}</strong>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ProductInfo;
