import {
  Box,
  Chip,
  Link as MuiLink,
  Typography,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { API_URL } from "../../../../constants.ts";
import type { Banner } from "../../../../types";
import ActionButtons from "./ActionButtons.tsx";

interface BannerCardProps {
  banner: Banner;
  onEdit: (id: string) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

const BannerCard = ({
  banner,
  onEdit,
  onToggleActive,
  onDelete,
}: BannerCardProps) => {
  return (
    <Card sx={{ width: "100%" }} data-testid="banner">
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              ID:
            </Typography>
            <Typography variant="body2" noWrap title={banner._id}>
              {banner._id}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {banner.title}
            </Typography>
            <Chip
              label={banner.isActive ? "Активен" : "Неактивен"}
              color={banner.isActive ? "success" : "default"}
              size="small"
            />
          </Box>

          {banner.description && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Описание:
              </Typography>
              <Typography variant="body2">{banner.description}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary">
              Ссылка:
            </Typography>
            {banner.link ? (
              <MuiLink
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{banner.link}</span>
                <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
              </MuiLink>
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1}
            >
              Изображение:
            </Typography>
            {banner.image ? (
              <Box
                component="img"
                src={`${API_URL}${banner.image}`}
                alt={banner.title}
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Box>

          <ActionButtons
            onEdit={() => onEdit(banner._id)}
            onDelete={() => onDelete(banner._id)}
            onToggleActive={() => onToggleActive(banner._id)}
            isActive={banner.isActive}
            editButtonProps={{
              fullWidth: true,
              sx: { mt: 1 },
            }}
            deleteButtonProps={{
              fullWidth: true,
              sx: { mt: 1 },
            }}
            toggleButtonProps={{
              fullWidth: true,
              sx: { mt: 1 },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BannerCard;
