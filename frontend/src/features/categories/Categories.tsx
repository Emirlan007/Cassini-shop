import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCategories } from "./categoryThunk";
import { 
  CircularProgress, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  Box, 
  Typography,
  alpha
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Props {
  onCategoryClick?: () => void;
}

const Categories = ({ onCategoryClick }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector((state) => state.categories.categoriesAll);
  const loading = useAppSelector((state) => state.categories.fetchingCategories);
  const error = useAppSelector((state) => state.categories.fetchError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <CircularProgress size={24} sx={{ color: "secondary.main" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" sx={{ color: "error.main", fontSize: "0.875rem" }}>
          Ошибка: {error}
        </Typography>
      </Box>
    );
  }

  const handleCategoryClick = (slug: string) => {
    navigate(`/products/${slug}`);
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Категории не найдены
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 1 }}>
      {categories.map((category, index) => (
        <ListItem 
          key={category._id} 
          disablePadding
          sx={{
            mb: index < categories.length - 1 ? 0.5 : 0,
          }}
        >
          <ListItemButton
            onClick={() => handleCategoryClick(category.slug)}
            sx={{
              mx: 1,
              py: 1.25,
              px: 2,
              borderRadius: 1.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: alpha("#F0544F", 0.08),
                transform: "translateX(4px)",
                "& .MuiListItemText-primary": {
                  color: "secondary.main",
                  fontWeight: 600,
                },
                "& .MuiSvgIcon-root": {
                  color: "secondary.main",
                  transform: "translateX(4px)",
                },
              },
              "&:active": {
                backgroundColor: alpha("#F0544F", 0.12),
              },
            }}
          >
            <ListItemText
              primary={category.title}
              primaryTypographyProps={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "text.primary",
                letterSpacing: "0.01em",
              }}
            />
            <ChevronRightIcon
              sx={{
                fontSize: "1.25rem",
                color: "text.secondary",
                opacity: 0.6,
                transition: "all 0.2s ease-in-out",
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </Box>
  );
};

export default Categories;
