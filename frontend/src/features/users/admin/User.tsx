import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Container,
  Button,
  Divider,
} from "@mui/material";
import { fetchAllUsers } from "./usersThunks";
import { selectUsers, selectIsLoading } from "./usersSlice";
import { fetchOrdersByUserId } from "../../orders/ordersThunk";
import {
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError,
} from "../../orders/ordersSlice";
import OrderCard from "../../orders/components/OrderCard";
import { useNavigate } from "react-router-dom";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const User = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(selectUsers);
  const usersLoading = useAppSelector(selectIsLoading);
  const userOrders = useAppSelector(selectUserOrders);
  const ordersLoading = useAppSelector(selectUserOrdersLoading);
  const ordersError = useAppSelector(selectUserOrdersError);

  const user = users.find((u) => u._id === userId);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userId));
    }
  }, [dispatch, userId]);

  const handleBackClick = () => {
    navigate("/admin/users");
  };

  if (usersLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Пользователь не найден</Alert>
        <Button
          startIcon={<NavigateBeforeIcon />}
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleBackClick}
        >
          Назад к списку
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        startIcon={<NavigateBeforeIcon />}
        variant="contained"
        sx={{ my: 2 }}
        onClick={handleBackClick}
      >
        Назад к списку
      </Button>

      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Профиль пользователя
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            p: 3,
            borderRadius: 2,
            mb: 4,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Основная информация
          </Typography>
          <Grid container spacing={2} sx={{flexDirection:"column"}}>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Имя:</strong> {user.name}
              </Typography>
            
            </Grid>
              <Divider></Divider>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Телефон:</strong> {user.phoneNumber}
              </Typography>
            </Grid>
               <Divider></Divider>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>ID:</strong> {user._id}
              </Typography>
            </Grid>
               <Divider></Divider>
             <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>City:</strong> {user.city}
              </Typography>
            </Grid>
               <Divider></Divider>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Address:</strong> {user.address}
              </Typography>
            </Grid>
            
          </Grid>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Заказы пользователя ({userOrders.length})
          </Typography>

          {ordersError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка при загрузке заказов: {ordersError}
            </Alert>
          )}

          {ordersLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : userOrders.length > 0 ? (
            <Box>
              {userOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                />
              ))}
            </Box>
          ) : (
            <Alert severity="info">У пользователя нет заказов</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default User;
