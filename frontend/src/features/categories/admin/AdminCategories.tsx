import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {useEffect, useState} from "react";
import {fetchCategories} from "../categoryThunk.ts";
import {
    Box,
    Button,
    CircularProgress,
    Divider, TextField,
    Typography
} from "@mui/material";
import {selectCategoryDeleteLoading, selectCategoryUpdateLoading} from "./categorySlice.ts";
import {deleteCategory, updateCategory} from "./categoryThunk.ts";


const AdminCategories = () => {
    const dispatch = useAppDispatch();

    const categories = useAppSelector((state) => state.categories.categoriesAll);
    const loading = useAppSelector((state) => state.categories.fetchingCategories);
    const deleteLoading = useAppSelector(selectCategoryDeleteLoading);
    const updateLoading = useAppSelector(selectCategoryUpdateLoading);

    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

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

    const handleEdit = (id: string, title: string) => {
        setEditId(id);
        setEditTitle(title);
    };

    const handleSave = async () => {
        if (!editId) return;

        try {
            await dispatch(updateCategory({ _id: editId, title: editTitle })).unwrap();
            setEditId(null);
            setEditTitle("");
            dispatch(fetchCategories());
        } catch (err) {
            console.error("Ошибка при обновлении категории:", err);
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setEditTitle("");
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
                        {editId === category._id ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%"  }}>
                                <TextField
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    disabled={updateLoading === category._id}
                                    fullWidth
                                />

                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        disabled={updateLoading === category._id}
                                    >
                                        {updateLoading === category._id ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            "Сохранить"
                                        )}
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                                        Отмена
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <Typography sx={{ color: "#660033" }}>{category.title}</Typography>
                                <Box sx={{ display: "flex", gap: 2 }} >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: "#F0544F",
                                            "&:hover": { backgroundColor: "#d33636" },
                                        }}
                                        onClick={() => handleEdit(category._id, category.title)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        sx={{
                                            backgroundColor: "#F0544F",
                                            "&:hover": { backgroundColor: "#d33636" },
                                        }}
                                        onClick={() => handleDelete(category._id)}
                                        disabled={deleteLoading === category._id}
                                    >
                                        {deleteLoading === category._id ? <CircularProgress size={20} color="inherit" /> : "Удалить"}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                    <Divider sx={{my: 1}}/>
                </>
            ))}
        </Box>
    );
};

export default AdminCategories;