import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectIsLoading, selectUsers} from "./usersSlice.ts";
import {useEffect} from "react";
import {fetchAllUsers} from "./usersThunks.ts";
import {Alert, CircularProgress, Grid} from "@mui/material";
import UserCard from "./components/UserCard.tsx";


const UsersList = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectUsers);
    const loading = useAppSelector(selectIsLoading);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    if (loading) return <CircularProgress />;

    if (!users.length)
        return <Alert severity="info">There are no users here!</Alert>;

    return (
        <Grid container spacing={2}>
            {users.map(user => (
                <Grid
                    size={{ xs: 12, sm: 6, md: 4 }}
                >
                    <UserCard key={user._id} user={user} />
                </Grid>
            ))}
        </Grid>
    );
};

export default UsersList;