import {useEffect} from "react";
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
    useMediaQuery,
    Stack, type Theme,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {
    selectBanners,
    selectBannersError,
    selectFetchBannersLoading,
} from "../bannersSlice";
import {fetchAllBanners} from "./BannersThunks.ts";
import {useNavigate} from "react-router-dom";
import {deleteBanner, toggleBannerActive} from "../bannersThunks.ts";
import BannerTableRow from "./components/BannerTableRow.tsx";
import BannerCard from "./components/BannerCard.tsx";

const AdminBannersList = () => {
    const dispatch = useAppDispatch();
    const banners = useAppSelector(selectBanners);
    const loading = useAppSelector(selectFetchBannersLoading);
    const error = useAppSelector(selectBannersError);
    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));

    useEffect(() => {
        void dispatch(fetchAllBanners());
    }, [dispatch]);

    const handleToggleActive = (id: string) => {
        dispatch(toggleBannerActive(id));
    };

    const removeBanner = async (id: string) => {
        await dispatch(deleteBanner(id));
    }

  const handleEditBanner = (id: string) => {
    navigate(`/admin/banners/${id}/update`);
  };

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
        Ошибка при загрузке баннеров: {error}
      </Typography>
    );
  }

  const renderHeader = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        width: '100%',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="h5">
        Все баннеры
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/admin/banners/new')}
        sx={{
          bgcolor: "#660033",
          color: "white",
          '&:hover': {
            bgcolor: "#55002a",
          },
        }}
      >
        Добавить баннер
      </Button>
    </Box>
  );

  const renderEmptyState = () => (
    <Box p={2}>
      <Typography textAlign="center">Баннеры не найдены</Typography>
    </Box>
  );

  // Мобилка
  if (isMobile) {
    return (
      <Box width="100%">
        {renderHeader()}

        <Stack spacing={2}>
          {banners.map((banner) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              onEdit={handleEditBanner}
              onToggleActive={handleToggleActive}
              onDelete={removeBanner}
            />
          ))}
        </Stack>

        {banners.length === 0 && renderEmptyState()}
      </Box>
    );
  }

  // Десктоп
  return (
    <Box width="100%">
      {renderHeader()}

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: 'auto' }}>
        <Table sx={{
          minWidth: isSmallScreen ? 900 : 1100,
          tableLayout: 'fixed',
          width: '100%',
        }}
               aria-label="admin banners table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: isSmallScreen ? '120px' : '150px' }}>ID</TableCell>
              <TableCell sx={{ width: isSmallScreen ? '150px' : '200px' }}>Название</TableCell>
              <TableCell sx={{ width: isSmallScreen ? '180px' : '240px' }}>Описание</TableCell>
              <TableCell sx={{ width: isSmallScreen ? '200px' : '250px' }}>Ссылка</TableCell>
              <TableCell sx={{ width: '100px' }}>Статус</TableCell>
              <TableCell sx={{ width: '160px' }}>Изображение</TableCell>
              <TableCell sx={{ width: '160px' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner) => (
              <BannerTableRow
                key={banner._id}
                banner={banner}
                onEdit={handleEditBanner}
                onToggleActive={handleToggleActive}
                onDelete={removeBanner}
                isSmallScreen={isSmallScreen}
              />
            ))}
          </TableBody>
        </Table>
        {banners.length === 0 && renderEmptyState()}
      </TableContainer>
    </Box>
  );
};

export default AdminBannersList;