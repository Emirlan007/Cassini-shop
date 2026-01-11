import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim() !== "" && searchQuery.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  console.log("SearchInput render");

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: "flex",
        width: "100%",
        height: 40,
        gap: 1,
      }}
    >
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("searchForProducts")}
        sx={{
          input: { p: 1 },
          flexGrow: 1,
          maxWidth: 500,
        }}
      />
      <Button variant="contained" type="submit" sx={{ flexShrink: 0 }}>
        Искать
      </Button>
    </Box>
  );
};

export default SearchInput;
