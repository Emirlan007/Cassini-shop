import {Link} from "react-router-dom";
import {Box, Typography} from "@mui/material";


const Logo = () => {
  return (
      <Box sx={{ display: "flex", flexDirection: 'column', alignItems: {
          lg: "flex-start",
          md: "flex-start",
          xs: "center",
          s: "center",
        }, fontSize: '11px', color: '#808080' }}>
        <Link to="/">
          <img src="/newLogo.png" alt="Cassini" style={{ width: '95px', height: '26px'}} />
        </Link>
        <Typography sx={{pt: '7px', fontSize: '11px'}}>
          Trending fashion for the modern woman.
        </Typography>
      </Box>
  );
};

export default Logo;