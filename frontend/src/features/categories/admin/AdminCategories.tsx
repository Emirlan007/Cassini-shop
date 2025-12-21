import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useEffect, useState } from "react";
import { fetchCategories } from "../categoryThunk.ts";
import {
  Box,
  Button,
  CircularProgress,
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

import CategoryItem from "./CategoryItem";
import CategoryCreateForm from "./CategoryCreateForm";

const AdminCategories = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(
      (state) => state.categories.categoriesAll
  );
  const loading = useAppSelector(
      (state) => state.categories.fetchingCategories
  );

  const deleteLoading = useAppSelector(selectCategoryDeleteLoading);
  const updateLoading = useAppSelector(selectCategoryUpdateLoading);
  const createLoading = useAppSelector(selectCategoryCreateLoading);

  const [createMode, setCreateMode] = useState(false);

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

  const handleUpdate = async (data: { _id: string; title: string }) => {
    try {
      await dispatch(updateCategory(data)).unwrap();
      dispatch(fetchCategories());
    } catch (err) {
      console.error("Ошибка при обновлении категории:", err);
    }
  };

  const handleCreate = async (title: string) => {
    try {
      await dispatch(createCategory({ title })).unwrap();
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
            <CategoryItem
                key={category._id}
                category={category}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                deleteLoading={deleteLoading}
                updateLoading={updateLoading}
            />
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
            <CategoryCreateForm
                loading={createLoading}
                onCreate={handleCreate}
                onCancel={() => setCreateMode(false)}
            />
        )}
      </Box>
  );
};

export default AdminCategories;
