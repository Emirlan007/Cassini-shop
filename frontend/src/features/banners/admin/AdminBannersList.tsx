import {useEffect} from "react";
import {
    Box,
    Button,
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
    useMediaQuery,
    Card,
    CardContent,
    Stack, type Theme,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import EditIcon from "@mui/icons-material/Edit";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {
    selectBanners,
    selectBannersError,
    selectFetchBannersLoading,
} from "../bannersSlice";
import {fetchAllBanners} from "./BannersThunks.ts";
import {API_URL} from "../../../constants.ts";
import {useNavigate} from "react-router-dom";

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

    if (isMobile) {
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
                        Все баннеры
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/admin/banners/new')}
                        sx={{
                            bgcolor: "#660033",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        Добавить баннер
                    </Button>
                </Box>

                <Stack spacing={2}>
                    {banners.map((banner) => (
                        <Card key={banner._id} sx={{ width: '100%' }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    {/* ID */}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            ID:
                                        </Typography>
                                        <Typography variant="body2" noWrap title={banner._id}>
                                            {banner._id}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {banner.title}
                                        </Typography>
                                        <Chip
                                            label={banner.isActive ? "Активен" : "Неактивен"}
                                            color={banner.isActive ? "success" : "default"}
                                            size="small"
                                        />
                                    </Box>

                                    {banner.description && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Описание:
                                            </Typography>
                                            <Typography variant="body2">
                                                {banner.description}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Ссылка:
                                        </Typography>
                                        {banner.link ? (
                                            <MuiLink
                                                href={banner.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                underline="none"
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    mt: 0.5,
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: "rgba(0, 0, 0, 0.04)",
                                                    color: "text.primary",
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    maxWidth: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <span>{banner.link}</span>
                                                <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
                                            </MuiLink>
                                        ) : (
                                            <Typography variant="body2">—</Typography>
                                        )}
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                            Изображение:
                                        </Typography>
                                        {banner.image ? (
                                            <Box
                                                component="img"
                                                src={`${API_URL}${banner.image}`}
                                                alt={banner.title}
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 300,
                                                    height: 120,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body2">—</Typography>
                                        )}
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/admin/banners/${banner._id}/update`)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            color: "#660033",
                                            borderColor: "#660033",
                                            mt: 1,
                                            '&:hover': {
                                                backgroundColor: "rgba(102, 0, 51, 0.04)",
                                                borderColor: "#660033",
                                            },
                                        }}
                                    >
                                        Редактировать
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                {banners.length === 0 && (
                    <Box p={2}>
                        <Typography textAlign="center">Баннеры не найдены</Typography>
                    </Box>
                )}
            </Box>
        );
    }

    // Десктоп
    return (
        <Box width="100%">
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
                    }}
                >
                    Добавить баннер
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ width: "100%", overflowX: 'auto' }}>
                <Table sx={{
                    minWidth: isSmallScreen ? 1000 : 1200,
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
                            <TableRow key={banner._id} hover>
                                <TableCell sx={{
                                    width: isSmallScreen ? '120px' : '150px',
                                    maxWidth: isSmallScreen ? '120px' : '150px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                           title={banner._id}>
                                    {banner._id}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: isSmallScreen ? '150px' : '200px',
                                        maxWidth: isSmallScreen ? '150px' : '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    {banner.title}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: isSmallScreen ? '180px' : '240px',
                                        maxWidth: isSmallScreen ? '180px' : '240px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                    title={banner.description || ''}>
                                    {banner.description || "—"}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: isSmallScreen ? '200px' : '250px',
                                        maxWidth: isSmallScreen ? '200px' : '250px',
                                    }}>
                                    {banner.link ? (
                                        <MuiLink
                                            href={banner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="none"
                                            title={banner.link}
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 1,
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: "rgba(0, 0, 0, 0.04)",
                                                color: "text.primary",
                                                fontWeight: 500,
                                                maxWidth: '100%',
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                transition: "background-color 0.2s",
                                                fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                                                "&:hover": {
                                                    bgcolor: "rgba(0, 0, 0, 0.08)",
                                                },
                                            }}
                                        >
                                            <span>{banner.link}</span>
                                            <OpenInNewRoundedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                                        </MuiLink>
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell sx={{ width: '100px' }}>
                                    <Chip
                                        label={banner.isActive ? "Активен" : "Неактивен"}
                                        color={banner.isActive ? "success" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ width: '160px' }}>
                                    {banner.image ? (
                                        <Box
                                            component="img"
                                            src={`${API_URL}${banner.image}`}
                                            alt={banner.title}
                                            sx={{
                                                width: 120,
                                                height: 60,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                            }}
                                        />
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell sx={{ width: '140px' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/admin/banners/${banner._id}/update`)}
                                        size="small"
                                        sx={{
                                            color: "#660033",
                                            borderColor: "#660033",
                                            fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                                            '&:hover': {
                                                backgroundColor: "rgba(102, 0, 51, 0.04)",
                                                borderColor: "#660033",
                                            },
                                        }}
                                    >
                                        {isSmallScreen ? "Ред." : "Редактировать"}
                                    </Button>
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