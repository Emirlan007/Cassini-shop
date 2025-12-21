import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

interface Props {
  loading: boolean;
  onCreate: (title: string) => void;
  onCancel: () => void;
}

const CategoryCreateForm = ({
                              loading,
                              onCreate,
                              onCancel,
                            }: Props) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate(title);
    setTitle("");
  };

  return (
      <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mt: 2,
          }}
      >
        <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название категории"
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#660033",
                "&:hover": { backgroundColor: "#F0544F" },
                width: "100%",
              }}
          >
            {loading ? (
                <CircularProgress size={20} color="inherit" />
            ) : (
                "Создать"
            )}
          </Button>

          <Button
              variant="outlined"
              onClick={() => {
                setTitle("");
                onCancel();
              }}
              sx={{ width: "100%" }}
          >
            Отмена
          </Button>
        </Box>
      </Box>
  );
};

export default CategoryCreateForm;
