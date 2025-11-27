import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect} from "react";
import {fetchCategories} from "../categoryThunk.ts";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Typography
} from "@mui/material";
import {selectCategoryDeleteLoading} from "./categorySlice.ts";
import {deleteCategory} from "./categoryThunk.ts";


const AdminCategories = () => {
    const dispatch = useAppDispatch();

    const categories = useAppSelector((state) => state.categories.categoriesAll);
    const loading = useAppSelector((state) => state.categories.fetchingCategories);
    const deleteLoading = useAppSelector(selectCategoryDeleteLoading)

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = async  (id: string) => {
        const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту категорию?");
        if (!isConfirmed) return;

        try {
            await dispatch(deleteCategory(id)).unwrap();
            dispatch(fetchCategories());
        } catch (err) {
            console.error("Ошибка при удалении категории:", err);
        }
    };

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", py: 3}}>
                <CircularProgress size={24} sx={{color: "secondary.main"}}/>
            </Box>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <Box sx={{px: 2, py: 1}}>
                <Typography variant="body2" sx={{color: "text.secondary", fontSize: "0.875rem"}}>
                    Категории не найдены
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{pb: 1}}>
            {categories.map((category) => (
                <>
                    <Box
                        key={category._id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                        }}
                    >
                        <Typography sx={{color: '#660033'}}>{category.title}</Typography>
                        <Button
                            sx={{
                                ml: "auto",
                                backgroundColor: "#F0544F",
                                "&:hover": {
                                    backgroundColor: "#d33636",
                                },
                        }}
                            loading={Boolean(deleteLoading)}
                            onClick={() => handleDelete(category._id)}
                        >
                            Удалить
                        </Button>
                    </Box>
                    <Divider sx={{my: 1}}/>
                </>
            ))}
        </Box>
    );
};

export default AdminCategories;