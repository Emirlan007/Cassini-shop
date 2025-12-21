import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { fetchPopularSearchKeywords } from './searchKeywordsThunks.ts';


const PopularSearchKeywords = () => {
  const dispatch = useAppDispatch();
  const { items, total, page, limit, loading } = useAppSelector(
    (state) => state.searchKeywords
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchPopularSearchKeywords({ 
      page: currentPage + 1, 
      limit: rowsPerPage 
    }));
  }, [dispatch, currentPage, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight={600}
        gutterBottom
        sx={{ mb: 3 }}
      >
        Популярные поисковые запросы
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={600}>
                          #
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>
                          Ключевое слово
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          Количество запросов
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="text.secondary" py={4}>
                            Нет данных для отображения
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={item.keyword} hover>
                          <TableCell>
                            {currentPage * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {item.keyword}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={500}>
                              {item.count}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={total}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} из ${count}`
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PopularSearchKeywords;
