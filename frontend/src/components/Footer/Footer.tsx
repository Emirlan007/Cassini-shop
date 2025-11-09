import {Box} from "@mui/material";
import DocLinks from "./DocLinks.tsx";
import Contacts from "./Contacts.tsx";
import SocialLinks from "./SocialLinks.tsx";


const Footer = () => {
    return (
        <Box sx={{
            pt: '20px',
            pb: '30px',
            backgroundColor: "#660033",
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center' ,
            flexDirection: { xs: 'column', md: 'row', sm: 'column' },
            justifyContent: 'center',
            gap: { xs: 4, sm: 4 , md: 12, lg: 20 },
        }}>
            <SocialLinks />
            <Contacts />
            <DocLinks />
        </Box>
    );
};

export default Footer;