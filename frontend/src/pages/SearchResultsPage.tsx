import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import {axiosApi} from "../axiosApi.ts";
import ProductList from "../features/products/ProductsList.tsx";

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axiosApi.get(`/products/search?q=${query}`);
      setProducts(response.data.products ?? response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   void fetchResults();
  }, [query]);

  return (
      <Box sx={{ px: 2, py: 3 }}>
        <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: 700 }}
        >
          Результаты поиска: "{query}"
        </Typography>

        {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
        )}

        {!loading && products.length === 0 && (
            <Typography sx={{ color: "#6b7280", mt: 2 }}>
              Ничего не найдено
            </Typography>
        )}

        {!loading && products.length > 0 && (
            <ProductList products={products} />
        )}
      </Box>
  );
};

export default SearchResultsPage;
