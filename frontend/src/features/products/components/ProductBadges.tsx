import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  discount?: number;
  isNew?: boolean;
}

export const ProductBadges: React.FC<Props> = ({ discount, isNew }) => {
  const { t } = useTranslation();

  if (!discount && !isNew) return null;

  return (
    <Stack
      position="absolute"
      top={8}
      left={8}
      zIndex={1}
      direction="row"
      spacing={1}
    >
      {discount && (
        <Box
          sx={{
            backgroundColor: "#ff4444",
            color: "white",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          -{discount}%
        </Box>
      )}
      {isNew && (
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
  );
};
