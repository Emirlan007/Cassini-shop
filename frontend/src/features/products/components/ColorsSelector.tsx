import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal";
import { findClosestColor } from "../../../utils/colorNormalizer";
import { useTranslation } from "react-i18next";

interface ColorsSelectorProps {
  colors: string[];
  onColorsUpdate: (value: string, checked: boolean) => void;
}

const ColorsSelector = ({ colors, onColorsUpdate }: ColorsSelectorProps) => {
  const [isColorsOpen, setColorsOpen] = useState(false);
  const { t } = useTranslation();

  const getClothesColorName = (hex: string) => {
    const colorName = findClosestColor(hex);
    return t(`colors.${colorName}`);
  };

  return (
    <>
      <ColorsModal
        open={isColorsOpen}
        onClose={() => setColorsOpen(false)}
        colors={colors}
        onChange={onColorsUpdate}
      />

      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="contained" onClick={() => setColorsOpen(true)}>
          Расцветки
        </Button>
        <Box component="div" sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {colors.map((color) => (
            <Box
              key={color}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                component="div"
                sx={{
                  width: "2rem",
                  height: "2rem",
                  background: color,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption">
                {getClothesColorName(color)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </>
  );
};

export default ColorsSelector;
