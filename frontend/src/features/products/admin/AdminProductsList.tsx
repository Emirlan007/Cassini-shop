import {
  Box,
    Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import {
  selectProducts,
  selectProductsFetchError,
  selectProductsFetchLoading,
} from "../productsSlice";
import { fetchProducts } from "../productsThunks";
import AdminProductCard from "./components/AdminProductCard";
import {useNavigate} from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";

const AdminProductsList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsFetchLoading);
  const error = useAppSelector(selectProductsFetchError);
  const navigate = useNavigate();

  useEffect(() => {
    void dispatch(fetchProducts(undefined));
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#F0544F" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="#F0544F" textAlign="center" mt={2}>
        Ошибка при загрузке товаров: {error}
      </Typography>
    );
  }

  return (
    <Box width="100%">
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                width: '100%'
            }}
        >
            <Typography variant="h5">
                Все товары
            </Typography>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/products/new')}
                sx={{
                    color: "white",
                    backgroundColor: "#660033",
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    },
                }}
            >
                Добавить товар
            </Button>
        </Box>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ minWidth: 650 }} aria-label="admin products table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Скидка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <AdminProductCard key={product._id} product={product} />
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <Box p={2}>
            <Typography textAlign="center">Товары не найдены</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default AdminProductsList;


