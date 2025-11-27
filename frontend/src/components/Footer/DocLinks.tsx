import {Stack, Typography} from "@mui/material";
import Link from "@mui/material/Link";

const DocLinks = () => {
    return (
        <Stack display='flex' flexDirection={'column'} alignItems={'center'} rowGap={1}>
          <Typography variant={'h6'} component={'h6'} sx={{color: '#1F2937', fontSize: '13px', fontWeight: 'bold'}}>Ссылки</Typography>
          <Link href='#' sx={{color: ' #808080', textDecoration: 'none', '&:hover': { color: '#F0544F' }, fontSize: '11px'}}>О нас</Link>
          <Link href='#' sx={{color: ' #808080', textDecoration: 'none', '&:hover': { color: '#F0544F' }, fontSize: '11px'}}>Политика конфиденциальности</Link>
          <Link href='#' sx={{color: ' #808080', textDecoration: 'none', '&:hover': { color: '#F0544F' }, fontSize: '11px'}}>Пользовательское соглашение</Link>
        </Stack>
    );
};

export default DocLinks;