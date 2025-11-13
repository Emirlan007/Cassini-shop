import { Box, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const AnonymousMenu = () => {
  return (
    <Box display="flex" gap={1}>
      <Button component={NavLink} to={"/login"} color="inherit">
        Sign In
      </Button>
    </Box>
  );
};

export default AnonymousMenu;
