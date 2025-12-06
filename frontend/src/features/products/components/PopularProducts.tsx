
import {Box, CircularProgress, Typography} from "@mui/material";
import ProductList from "../ProductsList.tsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    selectPopularLoading,
    selectPopularPage,
    selectPopularProducts,
    selectPopularTotalPages,
    selectPopularError,
} from "../productsSlice.ts";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect} from "react";
import {fetchPopularProducts} from "../productsThunks.ts";


const PopularProducts = () => {
    const dispatch = useAppDispatch();
    const popularProducts = useAppSelector(selectPopularProducts);
    const popularLoading = useAppSelector(selectPopularLoading);
    const popularPage = useAppSelector(selectPopularPage);
    const popularTotalPages = useAppSelector(selectPopularTotalPages);
    const popularError = useAppSelector(selectPopularError);

    useEffect(() => {
        dispatch(fetchPopularProducts({page: 1, limit: 8}));
    }, [dispatch])

    if (popularError) {
        return (
            <Typography textAlign="center" mt={2}>
                Ошибка при загрузке : {popularError}
            </Typography>
        );
    } else {
        return (
            <>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        fontSize: "17.6px",
                        lineHeight: "125%",
                        letterSpacing: "-0.02em",
                        color: "#111827",
                        mb: 8,
                    }}
                >
                    Популярные товары
                </Typography>

                <Box
                    id="scrollableDiv"
                    sx={{
                        position: "relative",
                        height: "1032px",
                        overflow: "auto",
                    }}
                >
                    {popularPage === 1 && popularLoading && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(255,255,255,0.7)",
                                zIndex: 10,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    <InfiniteScroll
                        dataLength={popularProducts.length}
                        next={() =>
                            dispatch(
                                fetchPopularProducts({
                                    page: popularPage + 1,
                                    limit: 8,
                                })
                            )
                        }
                        hasMore={popularPage < popularTotalPages}
                        loader={<Box>Loading...</Box>}
                        endMessage={"Все товары загружены"}
                        scrollableTarget="scrollableDiv"
                    >
                        <ProductList products={popularProducts} />
                    </InfiniteScroll>
                </Box>
            </>

        );
    }
};

export default PopularProducts;