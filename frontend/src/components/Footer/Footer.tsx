import {Box, Typography} from "@mui/material";
import DocLinks from "./DocLinks.tsx";
import Contacts from "./Contacts.tsx";
import SocialLinks from "./SocialLinks.tsx";
import Logo from "./Logo.tsx";
import {useTranslation} from "react-i18next";


const Footer = () => {
  const { t } = useTranslation();

    return (
        <>
          <Box sx={{
            pt: '20px',
            pb: '38px',
            backgroundColor: "#fff",
            borderTop: '0.80px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center' ,
            flexDirection: { xs: 'column', md: 'row', sm: 'column' },
            justifyContent: 'center',
            gap: { xs: 4, sm: 4 , md: 12, lg: 20 },
          }}>
            <Logo />
            <Contacts />
            <DocLinks />
            <SocialLinks />
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center',}}>
            <Typography sx={{width: '70%' ,pt: '26px', pb: '38px', borderTop: '0.80px solid #e5e7eb', fontSize: '11px', lineHeight: '143%',color: '#808080'}} display={'flex'} justifyContent={'center'}>
              © 2024 Cassini. {t("allRightsReserved")}.
            </Typography>
          </Box>
        </>
    );
};

export default Footer;