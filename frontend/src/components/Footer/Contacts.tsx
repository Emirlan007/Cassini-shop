import {Box} from "@mui/material";
import Link from "@mui/material/Link";

const Contacts = () => {
    return (
        <Box display="flex" gap={2}>
            <Link sx={{color: ' #FFFFFF'}} href='mailto:example@gmail.com'>Email</Link>
            <Link sx={{color: ' #FFFFFF'}} href='tel:+1234567890'>Телефон</Link>
        </Box>
    );
};

export default Contacts;