import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const languages = [
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
    { code: "kg", label: "KG" },
  ];

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FormControl
        size="small"
        sx={{
          backgroundColor: "primary.main",
          borderRadius: 1,
          fieldset: {
            border: "none",
          },
        }}
      >
        <Select
          value={currentLang}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          renderValue={(value) => (
            <Box display="flex" alignItems="center" gap={1}>
              <LanguageIcon fontSize="small" />
              {value.toUpperCase()}
            </Box>
          )}
        >
          {languages.map(({ code, label }) => (
            <MenuItem
              key={code}
              value={code}
              sx={{
                justifyContent: "center",
                fontWeight: currentLang === code ? "bold" : "normal",
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelect;
