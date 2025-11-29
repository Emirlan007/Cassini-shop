import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectIsLoading, selectUsers} from "./usersSlice.ts";
import {useEffect} from "react";
import {fetchAllUsers} from "./usersThunks.ts";
import {Alert, CircularProgress, Grid, Typography} from "@mui/material";
import UserCard from "./components/UserCard.tsx";
import {useNavigate} from "react-router-dom";


const UsersList = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const loading = useAppSelector(selectIsLoading);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleUserClick = (userId: string) => {
        navigate(`/admin/users/${userId}`);
    };

    if (loading) return <CircularProgress />;

    if (!users.length)
        return <Alert severity="info">There are no users here!</Alert>;

    return (
        <>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Список пользователей
            </Typography>
            <Grid container spacing={2}>
                {users.map(user => (
                    <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                '& > div': {
                                    boxShadow: 3,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }
                        }}
                    >
                        <UserCard user={user} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default UsersList;