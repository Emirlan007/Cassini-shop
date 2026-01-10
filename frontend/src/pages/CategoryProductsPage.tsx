import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  alpha,
  Container,
  Grid,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchFilteredProducts,
  fetchProducts,
} from "../features/products/productsThunks";
import {
  selectProducts,
  selectProductsFetchLoading,
  selectProductsFetchError,
  selectFilteredProducts,
  selectFilterLoading,
  selectFilterError,
  selectTotalCount,
  selectCurrentPage,
  selectTotalPages,
} from "../features/products/productsSlice";
import ProductList from "../features/products/ProductsList.tsx";
import type { FilterState, FilterParams } from "../types";
import ProductFilters from "../features/products/ProductFilters.tsx";
import { selectCategories } from "../features/categories/categorySlice.ts";
import { fetchCategories } from "../features/categories/categoryThunk.ts";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const CategoryProductsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectProductsFetchLoading);
  const error = useAppSelector(selectProductsFetchError);
  const allProducts = useAppSelector(selectProducts);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const filterLoading = useAppSelector(selectFilterLoading);
  const filterError = useAppSelector(selectFilterError);
  const totalCount = useAppSelector(selectTotalCount);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);

  const location = useLocation();

  const { t } = useTranslation();

  const currentCategory = useMemo(() => {
    if (!slug || !categories) return null;
    return categories.find((cat) => cat.slug === slug);
  }, [slug, categories]);

  const categoryId = currentCategory?._id;

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (!currentCategory && categories.length > 0 && slug) {
      console.error(`Category with slug "${slug}" not found`);
      navigate("/");
    }
  }, [currentCategory, categories, slug, navigate]);

  const availableOptions = useMemo(() => {
    if (!allProducts.length) {
      return {
        colors: [],
        sizes: [],
        materials: [],
        priceRange: { min: 0, max: 10000 },
      };
    }

    const colors = Array.from(new Set(allProducts.flatMap((p) => p.colors)));
    const sizes = Array.from(new Set(allProducts.flatMap((p) => p.size)));
    const prices = allProducts.map((p) => p.price);
    const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
    const materials = Array.from(
      new Set(
        allProducts
          .map((p) => p.material)
          .filter(Boolean)
          .filter(
            (material): material is string => typeof material === "string"
          )
      )
    );

    return {
      colors,
      sizes,
      materials,
      priceRange: { min: minPrice, max: maxPrice },
    };
  }, [allProducts]);

  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    sizes: [],
    priceRange: [
      availableOptions.priceRange.min,
      availableOptions.priceRange.max,
    ],
    inStock: undefined,
    isNew: undefined,
    isPopular: undefined,
    material: undefined,
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProducts(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (
      availableOptions.priceRange.min > 0 &&
      availableOptions.priceRange.max > 0
    ) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [
          availableOptions.priceRange.min,
          availableOptions.priceRange.max,
        ],
      }));
    }
  }, [availableOptions.priceRange]);

  useEffect(() => {
    if (categoryId && availableOptions.priceRange.min > 0) {
      const filterParams: FilterParams = {
        categoryId,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
        minPrice:
          filters.priceRange[0] !== availableOptions.priceRange.min
            ? filters.priceRange[0]
            : undefined,
        maxPrice:
          filters.priceRange[1] !== availableOptions.priceRange.max
            ? filters.priceRange[1]
            : undefined,
        inStock: filters.inStock !== undefined ? filters.inStock : undefined,
        isNew: filters.isNew !== undefined ? filters.isNew : undefined,
        isPopular:
          filters.isPopular !== undefined ? filters.isPopular : undefined,
        material: filters.material,
        page,
        limit: 16,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dispatch(fetchFilteredProducts(filterParams));
    }
  }, [dispatch, categoryId, filters, page, availableOptions.priceRange]);

  useEffect(() => {
    setPage(1);
  }, [
    filters.colors,
    filters.sizes,
    filters.priceRange,
    filters.inStock,
    filters.isNew,
    filters.isPopular,
    filters.material,
  ]);

  const handleFilterChange = (newFilters: FilterState) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      colors: [],
      sizes: [],
      priceRange: [
        availableOptions.priceRange.min,
        availableOptions.priceRange.max,
      ],
      inStock: undefined,
      isNew: undefined,
      isPopular: undefined,
      material: undefined,
    };
    setFilters(resetFilters);
  };

  const hasNoProducts =
    !loading && !filterLoading && filteredProducts.length === 0;
  const isLoading = loading || filterLoading;
  const showProducts =
    filteredProducts.length > 0 ? filteredProducts : allProducts;

  const title = `${currentCategory?.title} — купить онлайн`;
  const description = `Купить товары категории "${currentCategory?.title}". Найдено товаров: ${totalCount}. Актуальные цены и быстрая доставка`;
  const url = `${window.location.origin}${location.pathname}`;

  if (!currentCategory && categories.length > 0) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 3, sm: 4 }, textAlign: "center" }}
      >
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          {t("categoryNotFound")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          startIcon={<HomeIcon />}
        >
          {t("toMainPage")}
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <link rel="canonical" href={url} />

        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
      </Helmet>

      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
        {hasNoProducts && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                color: "secondary.main",
                borderColor: "secondary.main",
                "&:hover": {
                  borderColor: "secondary.main",
                  backgroundColor: alpha("#660033", 0.08),
                },
              }}
            >
              {t("toMainPage")}
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {filterError && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {filterError}
          </Alert>
        )}

        {hasNoProducts ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#660033",
                fontWeight: 600,
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                mb: 2,
              }}
            >
              {t("productsNotFound")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                maxWidth: "500px",
                mb: 3,
              }}
            >
              {t("changeTheFilterSettingsOrSelectAnotherCategory")}
            </Typography>
            <Button
              variant="contained"
              onClick={handleResetFilters}
              sx={{
                backgroundColor: "#660033",
                "&:hover": { backgroundColor: "#550022" },
              }}
            >
              {t("resetFilters")}
            </Button>
          </Box>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{
                color: "#660033",
                fontWeight: 600,
                textAlign: "center",
                fontSize: { xs: "1.75rem", sm: "2.125rem" },
                mb: 4,
              }}
            >
              {currentCategory
                ? `${t("productsInCategory")}: ${
                    currentCategory.title[
                      i18n.language as "ru" | "en" | "kg"
                    ] || currentCategory.title.ru
                  }`
                : t("productsInCategory")}
              {totalCount > 0 && (
                <Typography
                  component="span"
                  variant="body1"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    mt: 1,
                    fontWeight: "normal",
                  }}
                >
                  {t("itemsFound")}: {totalCount}
                </Typography>
              )}
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <ProductFilters
                  availableColors={availableOptions.colors}
                  availableSizes={availableOptions.sizes}
                  availableMaterials={availableOptions.materials}
                  priceRange={availableOptions.priceRange}
                  onFilterChange={handleFilterChange}
                  currentFilters={filters}
                  categoryId={categoryId!}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 9 }}>
                {isLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 8 }}
                  >
                    <CircularProgress sx={{ color: "#660033" }} />
                  </Box>
                ) : (
                  <>
                    <ProductList products={showProducts} />

                    {totalPages > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                          pt: 3,
                          borderTop: "1px solid #e0e0e0",
                        }}
                      >
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          sx={{
                            "& .MuiPaginationItem-root": {
                              color: "#660033",
                              "&.Mui-selected": {
                                backgroundColor: "#660033",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#550022",
                                },
                              },
                              "&:hover": {
                                backgroundColor: "rgba(102, 0, 51, 0.08)",
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default CategoryProductsPage;
