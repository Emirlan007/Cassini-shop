import {
  Box,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { findClosestColor } from "../../../utils/colorNormalizer";
import { useTranslation } from "react-i18next";
import theme from "../../../theme";
import { useAppSelector } from "../../../app/hooks";
import { selectProductFetchError } from "../productsSlice";
import { AVAILABLE_SIZES } from "../../../constants/sizes";

interface Props {
  colors?: string[];
  sizes?: string[];
  selectedColor: string | null;
  selectedSize: string | null;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

export const ProductVariants: React.FC<Props> = ({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) => {
  const error = useAppSelector(selectProductFetchError);
  const { t } = useTranslation();

  const getClothesColorName = (hex: string) => {
    const color = findClosestColor(hex);
    return t(`colors.${color}`);
  };

  return (
    <>
      {colors && colors?.length > 0 && (
        <Box mt={3}>
          <Typography
            mb={1}
            sx={{ color: "#525252", fontSize: "14px", fontWeight: "400" }}
          >
            {t("color")}:{" "}
            <strong style={{ color: "black" }}>
              {selectedColor && getClothesColorName(selectedColor)}
            </strong>
          </Typography>

          <Tabs
            value={selectedColor}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 0,
              "& .MuiTabs-flexContainer": { gap: "10px" },
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.secondary.main,
                height: 0,
              },
            }}
          >
            {colors.map((c) => (
              <Tab
                key={c}
                value={c}
                onClick={() => onColorChange(c)}
                label={
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      backgroundColor: c,
                      border:
                        selectedColor === c
                          ? `4px solid ${theme.palette.secondary.main}`
                          : "4px solid #ccc",
                      backgroundClip: "content-box",
                    }}
                  />
                }
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: 0,
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      <Box mt={3}>
        <Typography
          mb={1}
          sx={{ color: "#525252", fontSize: "14px", fontWeight: "400" }}
        >
          {t("size")} :
        </Typography>
        <ToggleButtonGroup
          value={selectedSize}
          exclusive
          onChange={(_, value) => {
            if (value !== null && sizes?.includes(value)) {
              onSizeChange(value);
            }
          }}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            "& .MuiToggleButtonGroup-grouped": {
              border: "1px solid #D9D9D9",
              borderRadius: "8px !important",
              margin: 0,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              "&:not(:first-of-type)": {
                marginLeft: 0,
                borderLeft: "1px solid #D9D9D9",
              },
              "&.Mui-selected": {
                border: "1px solid #000 !important",
                backgroundColor: "#F2F2F2",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#F2F2F2",
                },
              },
            },
          }}
        >
          {AVAILABLE_SIZES.map((size) => {
            const isAvailable = sizes?.includes(size);
            const isSelected = selectedSize === size;

            return (
              <ToggleButton
                key={size}
                value={size}
                disabled={!isAvailable}
                sx={{
                  textDecoration: isAvailable ? "" : "line-through",
                  color: isAvailable ? "#000" : "#999",
                  backgroundColor: isAvailable ? "#FFF" : "#F5F5F5",
                  cursor: isAvailable ? "pointer" : "default",
                  opacity: isAvailable ? 1 : 0.6,
                  "&:hover": {
                    backgroundColor: isAvailable
                      ? isSelected
                        ? "#F2F2F2"
                        : "#F9F9F9"
                      : "#F5F5F5",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#F2F2F2",
                    color: "#000",
                    "&.Mui-disabled": {
                      backgroundColor: "#F5F5F5",
                      color: "#999",
                    },
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#F5F5F5",
                    borderColor: "#E0E0E0",
                    color: "#999",
                  },
                }}
              >
                {size}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>

        {sizes && sizes.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: "#666",
              fontSize: "12px",
            }}
          >
            {t("availableSizes")} {sizes?.join(", ")}
          </Typography>
        )}

        {selectedSize && !sizes?.includes(selectedSize) && (
          <Typography
            color="error"
            variant="caption"
            sx={{ display: "block", mt: 1 }}
          >
            Этот размер недоступен для данного товара
          </Typography>
        )}

        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ display: "block", mt: 1 }}
          >
            Ошибка: {error}. Доступные размеры: {sizes?.join(", ") || "нет"}
          </Typography>
        )}
      </Box>
    </>
  );
};
