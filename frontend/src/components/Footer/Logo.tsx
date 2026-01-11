import {Link} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";


const Logo = () => {
  const { t } = useTranslation();

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
          {t("footerLogoText")}
        </Typography>
      </Box>
  );
};

export default Logo;