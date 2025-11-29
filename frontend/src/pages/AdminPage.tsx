import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Container,
} from '@mui/material';
import {
    People as PeopleIcon,
    ShoppingCart as OrdersIcon,
    Category as CategoryIcon,
    Inventory as ProductsIcon,
    FeaturedVideo as BannersIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();

    const adminLinks = [
        {
            title: 'Пользователи',
            path: '/admin/users',
            icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Управление пользователями системы',
        },
        {
            title: 'Заказы',
            path: '/admin/orders',
            icon: <OrdersIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Просмотр и управление заказами',
        },
        {
            title: 'Категории',
            path: '/admin/categories',
            icon: <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Управление категориями товаров',
        },
        {
            title: 'Товары',
            path: '/admin/products',
            icon: <ProductsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Управление товарами и добавление новых',
        },
        {
            title: 'Баннеры',
            path: '/admin/banners',
            icon: <BannersIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: 'Управление баннерами на главной странице',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    mb: 4,
                    textAlign: 'center'
                }}
            >
                Панель администратора
            </Typography>

            <Grid container spacing={3}>
                {adminLinks.map((link) => (
                    <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={link.path}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                },
                            }}
                        >
                            <CardActionArea
                                sx={{ height: '100%' }}
                                onClick={() => navigate(link.path)}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 3, bgcolor: "#660033",
                                    color: "white", }}>
                                    <Box sx={{ mb: 2 }}>
                                        {link.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        gutterBottom
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {link.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="white"
                                    >
                                        {link.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminPage;