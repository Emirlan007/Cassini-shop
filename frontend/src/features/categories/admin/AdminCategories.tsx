import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../categoryThunk.ts";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import {
  selectCategoryDeleteLoading,
  selectCategoryUpdateLoading,
  selectCategoryCreateLoading,
} from "./categorySlice.ts";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./categoryThunk.ts";
import type { TranslatedField, ICategory } from "../../../types";
import { API_URL } from "../../../constants";
import { Stack } from "@mui/material";

const getTranslatedTitle = (category: ICategory, language: string): string => {
  const lang = language.split("-")[0] as "ru" | "en" | "kg";
  return category.title?.[lang] || category.title?.ru || "";
};

const AdminCategories = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const categories = useAppSelector((state) => state.categories.categoriesAll);
  const loading = useAppSelector(
    (state) => state.categories.fetchingCategories
  );

  const deleteLoading = useAppSelector(selectCategoryDeleteLoading);
  const updateLoading = useAppSelector(selectCategoryUpdateLoading);
  const createLoading = useAppSelector(selectCategoryCreateLoading);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<TranslatedField>({
    ru: "",
    en: "",
    kg: "",
  });

  const [createMode, setCreateMode] = useState(false);
  const [newTitle, setNewTitle] = useState<TranslatedField>({
    ru: "",
    en: "",
    kg: "",
  });

  const [translating, setTranslating] = useState(false);

  const translateToEn = async (text: string, mode: "edit" | "create") => {
    if (!text.trim()) return;

    try {
      setTranslating(true);

      const res = await fetch(`${API_URL}translation/translate/en`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Translation failed");
      }

      const data: { translation: string } = await res.json();

      if (mode === "edit") {
        setEditTitle((prev) => ({ ...prev, en: data.translation }));
      } else {
        setNewTitle((prev) => ({ ...prev, en: data.translation }));
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить эту категорию?"
    );
    if (!isConfirmed) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
    }
  };

  const handleEdit = (id: string, title: TranslatedField) => {
    setEditId(id);
    setEditTitle(title);
  };

  const handleSave = async () => {
    if (!editId) return;

    try {
      await dispatch(
        updateCategory({
          _id: editId,
          title: editTitle,
        })
      ).unwrap();
      setEditId(null);
      setEditTitle({ ru: "", en: "", kg: "" });
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при обновлении категории:", err);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.ru.trim() || !newTitle.en.trim() || !newTitle.kg.trim())
      return;

    try {
      await dispatch(
        createCategory({
          title: newTitle,
        })
      ).unwrap();
      setNewTitle({ ru: "", en: "", kg: "" });
      setCreateMode(false);
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при создании категории:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 1 }}>
      {categories.map((category) => (
        <Box key={category._id}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            {editId === category._id ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                }}
              >
                <TextField
                  label="Русский"
                  value={editTitle.ru}
                  onChange={(e) =>
                    setEditTitle({ ...editTitle, ru: e.target.value })
                  }
                  disabled={updateLoading === category._id}
                  fullWidth
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="English"
                    value={editTitle.en}
                    onChange={(e) =>
                      setEditTitle({ ...editTitle, en: e.target.value })
                    }
                    disabled={updateLoading === category._id}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => translateToEn(editTitle.ru, "edit")}
                    disabled={
                      !editTitle.ru ||
                      translating ||
                      updateLoading === category._id
                    }
                    sx={{
                      minWidth: 48,
                      height: 56,
                      backgroundColor: "#660033",
                      "&:hover": { backgroundColor: "#F0544F" },
                    }}
                  >
                    {translating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Перевести"
                    )}
                  </Button>
                </Stack>
                <TextField
                  label="Кыргызча"
                  value={editTitle.kg}
                  onChange={(e) =>
                    setEditTitle({ ...editTitle, kg: e.target.value })
                  }
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
                    color="secondary"
                    onClick={() => {
                      setEditId(null);
                      setEditTitle({ ru: "", en: "", kg: "" });
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
                <Typography variant={"h6"} sx={{ color: "#660033" }}>
                  {getTranslatedTitle(category, i18n.language)}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
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
          <Divider sx={{ my: 1 }} />
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            fullWidth
            label="Русский"
            value={newTitle.ru}
            onChange={(e) => setNewTitle({ ...newTitle, ru: e.target.value })}
            placeholder="Название категории на русском"
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="English"
              value={newTitle.en}
              onChange={(e) => setNewTitle({ ...newTitle, en: e.target.value })}
              placeholder="Category name in English"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => translateToEn(newTitle.ru, "create")}
              disabled={!newTitle.ru || translating}
              sx={{
                minWidth: 48,
                height: 56,
                backgroundColor: "#660033",
                "&:hover": { backgroundColor: "#F0544F" },
              }}
            >
              {translating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Перевести"
              )}
            </Button>
          </Stack>
          <TextField
            fullWidth
            label="Кыргызча"
            value={newTitle.kg}
            onChange={(e) => setNewTitle({ ...newTitle, kg: e.target.value })}
            placeholder="Категориянын аталышы кыргызча"
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              disabled={createLoading}
              onClick={handleCreate}
              sx={{
                backgroundColor: "#660033",
                "&:hover": { backgroundColor: "#F0544F" },
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
                setNewTitle({ ru: "", en: "", kg: "" });
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
