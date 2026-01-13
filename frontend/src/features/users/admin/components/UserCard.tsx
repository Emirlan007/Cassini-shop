import { Grid, Typography } from "@mui/material";
import type { AdminUser } from "../../../../types";

interface Props {
  user: AdminUser;
}

const UserCard = ({ user }: Props) => {
  return (
    <Grid
      sx={{
        border: "1px solid #ccc",
        p: 2,
        borderRadius: 1,
      }}
    >
      <Typography>Имя: {user.name}</Typography>
      <Typography>Телефон: {user.phoneNumber}</Typography>
    </Grid>
  );
};

export default UserCard;
