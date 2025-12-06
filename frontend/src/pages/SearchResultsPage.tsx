import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { axiosApi } from "../axiosApi.ts";
import ProductList from "../features/products/ProductsList.tsx";
import type { AxiosResponse } from "axios";
import type { Product } from "../types";

interface ProductsSearch {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  searchQuery: string;
}

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const loadMoreRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const fetchResults = useCallback(
    async (pageToLoad: number) => {
      if (totalPages > 0 && pageToLoad > totalPages) return;

      scrollPositionRef.current = window.scrollY;

      setLoading(true);

      try {
        const response: AxiosResponse<ProductsSearch> = await axiosApi.get(
          `/products/search?q=${query}&page=${pageToLoad}`
        );

        const {
          products: newProducts,
          currentPage,
          hasMore,
          totalCount,
          totalPages,
        } = response.data;

        console.log(response.data);

        setProducts((prev) => [...prev, ...newProducts]);

        setHasMore(hasMore);
        setCurrentPage(currentPage);
        setTotal(totalCount ?? 0);
        setTotalPages(totalPages ?? 0);
      } finally {
        setLoading(false);
      }
    },
    [totalPages, query]
  );

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    fetchResults(1);
  }, [query, fetchResults]);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting || !hasMore || loading) return;

      const next = currentPage + 1;
      setCurrentPage(next);
      fetchResults(next);
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isMobile, hasMore, loading, currentPage, fetchResults]);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current);
    });
  }, [products]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 1000) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Результаты поиска: "{query}"
      </Typography>

      {loading && currentPage === 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && products.length === 0 && (
        <Typography sx={{ color: "#6b7280", mt: 2 }}>
          Ничего не найдено
        </Typography>
      )}

      {!loading && products.length > 0 && <ProductList products={products} />}

      {total > 0 && hasMore && (
        <Typography sx={{ mt: 2, textAlign: "center", color: "#808080" }}>
          Загружено {products.length} из {total} товаров
        </Typography>
      )}

      {!isMobile && hasMore && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => {
              const next = currentPage + 1;
              setCurrentPage(next);
              fetchResults(next);
            }}
            loading={loading}
          >
            Показать ещё
          </Button>
        </Box>
      )}

      {products.length > 0 && !hasMore && (
        <Typography variant="h4" sx={{ mt: 2, textAlign: "center" }}>
          Все результаты загружены
        </Typography>
      )}

      {isMobile && loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      <Box ref={loadMoreRef} />

      {showScrollTop && (
        <Box
          sx={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 999,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={scrollToTop}
            sx={{
              borderRadius: "50%",
              minWidth: 0,
              width: 50,
              height: 50,
              fontSize: 24,
            }}
          >
            ↑
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsPage;
