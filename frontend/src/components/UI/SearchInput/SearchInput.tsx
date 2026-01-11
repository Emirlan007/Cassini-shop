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
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("searchForProducts")}
        sx={{
          input: { p: 1 },
          width: 400,
        }}
      />
      <Button variant="contained" type="submit">
        Искать
      </Button>
    </Box>
  );
};

export default SearchInput;
