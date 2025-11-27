import {Box, Typography} from "@mui/material";
import Link from "@mui/material/Link";

const Contacts = () => {
    return (
        <Box display="flex" gap={2} flexDirection={'column'} alignItems={'center'}>
            <Typography variant={'h6'} component={'h6'} sx={{color: '#1F2937', fontSize: '13px', fontWeight: 'bold'}}>Контакты</Typography>
            <Link sx={{color: ' #808080', textDecoration: 'none', '&:hover': { color: '#F0544F' }, fontSize: '11px'}} href='mailto:example@gmail.com'>Email</Link>
            <Link sx={{color: ' #808080', textDecoration: 'none', '&:hover': { color: '#F0544F' }, fontSize: '11px'}} href='tel:+1234567890'>Телефон</Link>
        </Box>
    );
};

export default Contacts;