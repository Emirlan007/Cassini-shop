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
import { useTranslation } from "react-i18next";
import SearchInput from "../components/UI/SearchInput/SearchInput.tsx";

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

  const { t, i18n } = useTranslation();

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

  const currentLang = i18n.language.slice(0, 2) as "ru" | "en" | "kg";

  const fetchResults = useCallback(
    async (pageToLoad: number, replace = false) => {
      if ((totalPages > 0 && pageToLoad > totalPages) || !query.trim()) return;

      scrollPositionRef.current = window.scrollY;

      try {
        setLoading(true);

        const response: AxiosResponse<ProductsSearch> = await axiosApi.get(
          `/products/search?q=${query}&limit=${2}&page=${pageToLoad}&lang=${currentLang}`
        );

        const {
          products: newProducts,
          hasMore,
          totalCount,
          totalPages,
        } = response.data;

        setProducts((prev) =>
          replace ? newProducts : [...prev, ...newProducts]
        );

        setHasMore(hasMore);
        setTotal(totalCount ?? 0);
        setTotalPages(totalPages ?? 0);
      } finally {
        setLoading(false);
      }
    },
    [query, currentLang]
  );

  useEffect(() => {
    if (!query.trim()) return;

    setCurrentPage(1);
    setHasMore(true);
    fetchResults(1, currentPage === 1);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;

    const pagesToLoad = currentPage;

    setProducts([]);
    setHasMore(true);

    const reload = async () => {
      for (let page = 1; page <= pagesToLoad; page++) {
        await fetchResults(page, page === 1);
      }
    };

    reload();
  }, [currentLang]);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;

      setCurrentPage((prev) => {
        if (loading || !hasMore) return prev;
        const next = prev + 1;
        fetchResults(next);
        return next;
      });
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isMobile, hasMore, loading, fetchResults]);

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
    <Box>
      <SearchInput />

      {query && (
        <Typography variant="h5" sx={{ my: 3, fontWeight: 700 }}>
          {t("searchResults")}: "{query}"
        </Typography>
      )}

      {loading && currentPage === 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="inherit" />
        </Box>
      )}

      {!loading && products.length === 0 && query && (
        <Typography sx={{ color: "#6b7280", mt: 2 }}>
          {t("nothingFound")}
        </Typography>
      )}

      {!loading && products.length > 0 && <ProductList products={products} />}

      {total > 0 && hasMore && (
        <Typography sx={{ mt: 2, textAlign: "center", color: "#808080" }}>
          {t("productsLoaded", { loaded: products.length, total })}
        </Typography>
      )}

      {!isMobile && hasMore && query && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) => {
                if (loading || !hasMore) return prev;

                const next = prev + 1;
                fetchResults(next);
                return next;
              })
            }
            loading={loading}
          >
            {t("showMore")}
          </Button>
        </Box>
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
