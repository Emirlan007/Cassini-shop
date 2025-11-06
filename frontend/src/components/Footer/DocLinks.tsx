import {Stack} from "@mui/material";
import Link from "@mui/material/Link";

const DocLinks = () => {
    return (
        <Stack display='flex' rowGap={1}>
            <Link href='#' sx={{color: ' #FFFFFF'}}>Политика конфиденциальности</Link>
            <Link href='#' sx={{color: ' #FFFFFF'}}>Пользовательское соглашение</Link>
        </Stack>
    );
};

export default DocLinks;