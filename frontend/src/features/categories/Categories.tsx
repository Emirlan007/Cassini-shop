import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCategories } from "../../features/categories/categoryThunk";
import {CircularProgress} from "@mui/material";

const Categories = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categoriesAll);
  const loading = useAppSelector((state) => state.categories.fetchingCategories);
  const error = useAppSelector((state) => state.categories.fetchError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
      <div>
        <h2>Категории</h2>
        <ul>
          {categories.map((category) => (
              <li key={category._id}>{category.title}</li>
          ))}
        </ul>
      </div>
  );
};

export default Categories;
