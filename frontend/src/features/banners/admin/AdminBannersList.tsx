import {useEffect} from "react";
import {
    Box,
    Chip,
    CircularProgress,
    Link as MuiLink,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {
    selectBanners,
    selectBannersError,
    selectFetchBannersLoading,
} from "../bannersSlice";
import {fetchAllBanners} from "./BannersThunks.ts";
import {API_URL} from "../../../constants.ts";

const AdminBannersList = () => {
    const dispatch = useAppDispatch();
    const banners = useAppSelector(selectBanners);
    const loading = useAppSelector(selectFetchBannersLoading);
    const error = useAppSelector(selectBannersError);

    useEffect(() => {
        void dispatch(fetchAllBanners());
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
                Ошибка при загрузке баннеров: {error}
            </Typography>
        );
    }

    return (
        <Box width="100%">
            <Typography variant="h5" mb={2}>
                Все баннеры
            </Typography>
            <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table sx={{ minWidth: 800 }} aria-label="admin banners table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Ссылка</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Изображение</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner._id} hover>
                                <TableCell sx={{ maxWidth: 180 }} title={banner._id}>
                                    {banner._id}
                                </TableCell>
                                <TableCell>{banner.title}</TableCell>
                                <TableCell sx={{ maxWidth: 240 }}>
                                    {banner.description || "—"}
                                </TableCell>
                                <TableCell>
                                    {banner.link ? (
                                        <MuiLink
                                            href={banner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="hover"
                                        >
                                            {banner.link}
                                        </MuiLink>
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={banner.isActive ? "Активен" : "Неактивен"}
                                        color={banner.isActive ? "success" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {banner.image ? (
                                        <Box
                                            component="img"
                                            src={`${API_URL}${banner.image}`}
                                            alt={banner.title}
                                            sx={{
                                                width: 140,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {banners.length === 0 && (
                    <Box p={2}>
                        <Typography textAlign="center">Баннеры не найдены</Typography>
                    </Box>
                )}
            </TableContainer>
        </Box>
    );
};

export default AdminBannersList;

