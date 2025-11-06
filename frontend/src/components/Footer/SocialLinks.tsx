import {Box} from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const SocialLinks = () => {
    return (
        <Box display="flex" gap={2}>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ color: '#FFFFFF', '&:hover': { color: '#F0544F' } }} />
            </a>

            <a href="https://web.telegram.org/" target="_blank" rel="noopener noreferrer">
                <TelegramIcon sx={{ color: '#FFFFFF', '&:hover': { color: '#F0544F' } }} />
            </a>

            <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon sx={{ color: '#FFFFFF', '&:hover': { color: '#F0544F' } }} />
            </a>

        </Box>
    );
};

export default SocialLinks;