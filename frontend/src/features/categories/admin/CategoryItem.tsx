import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

interface Category {
  _id: string;
  title: string;
}

interface Props {
  category: Category;
  onDelete: (id: string) => void;
  onUpdate: (data: { _id: string; title: string }) => void;
  deleteLoading: string | null;
  updateLoading: string | null;
}

const CategoryItem = ({
                        category,
                        onDelete,
                        onUpdate,
                        deleteLoading,
                        updateLoading,
                      }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(category.title);

  const handleSave = () => {
    onUpdate({ _id: category._id, title: editTitle });
    setEditMode(false);
  };

  return (
      <Box>
        <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
        >
          {editMode ? (
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  }}
              >
                <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    disabled={updateLoading === category._id}
                    fullWidth
                />

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={updateLoading === category._id}
                      sx={{
                        backgroundColor: "#660033",
                        "&:hover": { backgroundColor: "#F0544F" },
                      }}
                  >
                    {updateLoading === category._id ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Сохранить"
                    )}
                  </Button>

                  <Button
                      variant="contained"
                      onClick={() => {
                        setEditMode(false);
                        setEditTitle(category.title);
                      }}
                      sx={{
                        backgroundColor: "#660033",
                        "&:hover": { backgroundColor: "#F0544F" },
                      }}
                  >
                    Отмена
                  </Button>
                </Box>
              </Box>
          ) : (
              <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 0 },
                    width: "100%",
                  }}
              >
                <Typography variant="h6" sx={{ color: "#660033" }}>
                  {category.title}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                      variant="contained"
                      size="small"
                      onClick={() => setEditMode(true)}
                      sx={{
                        backgroundColor: "#660033",
                        "&:hover": { backgroundColor: "#F0544F" },
                      }}
                  >
                    Редактировать
                  </Button>

                  <Button
                      size="small"
                      onClick={() => onDelete(category._id)}
                      disabled={deleteLoading === category._id}
                      sx={{
                        backgroundColor: "#660033",
                        color: "white",
                        "&:hover": { backgroundColor: "#F0544F" },
                      }}
                  >
                    {deleteLoading === category._id ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Удалить"
                    )}
                  </Button>
                </Box>
              </Box>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />
      </Box>
  );
};

export default CategoryItem;
