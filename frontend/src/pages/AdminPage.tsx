import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Container,
} from "@mui/material";
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Category as CategoryIcon,
  Inventory as ProductsIcon,
  FeaturedVideo as BannersIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const adminLinks = [
    {
      title: t("admin.users"),
      path: "/admin/users",
      icon: <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.usersDescription"),
    },
    {
      title: t("admin.orders"),
      path: "/admin/orders",
      icon: <OrdersIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.ordersDescription"),
    },
    {
      title: t("categories"),
      path: "/admin/categories",
      icon: <CategoryIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.categoriesDescription"),
    },
    {
      title: t("admin.products"),
      path: "/admin/products",
      icon: <ProductsIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.productsDescription"),
    },
    {
      title: t("admin.banners"),
      path: "/admin/banners",
      icon: <BannersIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.bannersDescription"),
    },
    {
      title: t("admin.ordersAnalytics"),
      path: "/admin/analytics/orders",
      icon: <AnalyticsIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.ordersAnalyticsDescription"),
    },
    {
      title: t("admin.productsAnalytics"),
      path: "/admin/analytics/products",
      icon: <AnalyticsIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.productsAnalyticsDescription"),
    },
    {
      title: t("admin.searchKeywords"),
      path: "/admin/analytics/search-keywords",
      icon: <SearchIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      description: t("admin.searchKeywordsDescription"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 3,
          textAlign: "center",
        }}
      >
        {t("admin.panel")}
      </Typography>

      <Grid container spacing={2}>
        {adminLinks.map((link) => (
          <Grid sx={{ flex: "1 1 280px" }} key={link.path}>
            <Card
              sx={{
                height: 180,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
                onClick={() => navigate(link.path)}
              >
                <CardContent
                  sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "#660033",
                    color: "white",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>{link.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5 }}
                  >
                    {link.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{ fontSize: "0.85rem" }}
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
