import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect, useState} from "react";
import {fetchCategories} from "../categoryThunk.ts";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography
} from "@mui/material";
import {
  selectCategoryDeleteLoading,
  selectCategoryUpdateLoading,
  selectCategoryCreateLoading
} from "./categorySlice.ts";
import {createCategory, deleteCategory, updateCategory} from "./categoryThunk.ts";
import {Add as AddIcon} from "@mui/icons-material";

const AdminCategories = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categoriesAll);
  const loading = useAppSelector((state) => state.categories.fetchingCategories);

  const deleteLoading = useAppSelector(selectCategoryDeleteLoading);
  const updateLoading = useAppSelector(selectCategoryUpdateLoading);
  const createLoading = useAppSelector(selectCategoryCreateLoading);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [createMode, setCreateMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async  (id: string) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту категорию?");
    if (!isConfirmed) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
    }
  };

  const handleEdit = (id: string, title: string) => {
    setEditId(id);
    setEditTitle(title);
  };

  const handleSave = async () => {
    if (!editId) return;

    try {
      await dispatch(updateCategory({ _id: editId, title: editTitle })).unwrap();
      setEditId(null);
      setEditTitle("");
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при обновлении категории:", err);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      await dispatch(createCategory({ title: newTitle })).unwrap();
      setNewTitle("");
      setCreateMode(false);
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при создании категории:", err);
    }
  };

  if (loading) {
    return (
        <Box sx={{display: "flex", justifyContent: "center", py: 3}}>
          <CircularProgress size={24} sx={{color: "secondary.main"}}/>
        </Box>
    );
  }

  return (
      <Box sx={{pb: 1}}>
        {categories.map((category) => (
            <Box key={category._id}>
              <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
              >
                {editId === category._id ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%"  }}>
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
                              backgroundColor: "#F0544F",
                              "&:hover": { backgroundColor: "#d33636" },
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
                            color="secondary"
                            onClick={() => {
                              setEditId(null);
                              setEditTitle("");
                            }}
                            sx={{
                              backgroundColor: "#F0544F",
                              "&:hover": { backgroundColor: "#d33636" },
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
                      <Typography
                          variant={'h6'}
                          sx={{ color: "#660033" }}
                      >
                        {category.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }} >
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#660033",
                              "&:hover": { backgroundColor: "#F0544F" },
                            }}
                            onClick={() => handleEdit(category._id, category.title)}
                        >
                          Редактировать
                        </Button>

                        <Button
                            sx={{
                              backgroundColor: "#660033",
                              "&:hover": { backgroundColor: "#F0544F" },
                            }}
                            onClick={() => handleDelete(category._id)}
                            disabled={deleteLoading === category._id}
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
              <Divider sx={{my: 1}}/>
            </Box>
        ))}
        {!createMode ? (
            <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#660033",
                  "&:hover": { backgroundColor: "#F0544F" },
                }}
                onClick={() => setCreateMode(true)}
            >
              Создать категорию
            </Button>
        ) : (
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mt: 2,
             }}>
              <TextField
                  fullWidth
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Название категории"
                  sx={{ mb: 1 }}
              />

              <Box sx={{ display: "flex",}}>
                <Button
                    variant="contained"
                    disabled={createLoading}
                    onClick={handleCreate}
                    sx={{
                      backgroundColor: "#F0544F",
                      "&:hover": { backgroundColor: "#d33636" },
                      width: "100%",
                    }}
                >
                  {createLoading ? (
                      <CircularProgress size={20} color="inherit" />
                  ) : (
                      "Создать"
                  )}
                </Button>

                <Button
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onClick={() => {
                      setCreateMode(false);
                      setNewTitle("");
                    }}
                >
                  Отмена
                </Button>
              </Box>
            </Box>
        )}

      </Box>
  );
};

export default AdminCategories;
