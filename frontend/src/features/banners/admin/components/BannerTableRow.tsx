import { TableRow, TableCell, Chip, Link as MuiLink, Box } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { API_URL } from "../../../../constants.ts";
import type { Banner } from "../../../../types";
import ActionButtons from "./ActionButtons.tsx";

interface BannerTableRowProps {
    banner: Banner;
    onEdit: (id: string) => void;
    onToggleActive: (id: string) => void;
    onDelete: (id: string) => void;
    isSmallScreen: boolean;
}

const BannerTableRow = ({
                            banner,
                            onEdit,
                            onToggleActive,
                            onDelete,
                            isSmallScreen,
                        }: BannerTableRowProps) => {
    const getBannerText = (
        field: string | { ru: string; en?: string; kg?: string } | undefined,
        defaultValue: string = "—"
    ): string => {
        if (!field) return defaultValue;
        if (typeof field === "string") return field;
        return field.ru || defaultValue;
    };

    const titleText = getBannerText(banner.title);
    const descriptionText = getBannerText(banner.description);

    return (
        <TableRow key={banner._id} hover>
            <TableCell
                sx={{
                    width: isSmallScreen ? "120px" : "150px",
                    maxWidth: isSmallScreen ? "120px" : "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={banner._id}
            >
                {banner._id}
            </TableCell>
            <TableCell
                sx={{
                    width: isSmallScreen ? "150px" : "200px",
                    maxWidth: isSmallScreen ? "150px" : "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={titleText}
            >
                {titleText}
            </TableCell>
            <TableCell
                sx={{
                    width: isSmallScreen ? "180px" : "240px",
                    maxWidth: isSmallScreen ? "180px" : "240px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={descriptionText}
            >
                {descriptionText}
            </TableCell>
            <TableCell
                sx={{
                    width: isSmallScreen ? "200px" : "250px",
                    maxWidth: isSmallScreen ? "200px" : "250px",
                }}
            >
                {banner.link ? (
                    <MuiLink
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                        title={banner.link}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: "rgba(0, 0, 0, 0.04)",
                            color: "text.primary",
                            fontWeight: 500,
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            transition: "background-color 0.2s",
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.08)",
                            },
                        }}
                    >
                        <span>{banner.link}</span>
                        <OpenInNewRoundedIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                    </MuiLink>
                ) : (
                    "—"
                )}
            </TableCell>
            <TableCell sx={{ width: "100px" }}>
                <Chip
                    label={banner.isActive ? "Активен" : "Неактивен"}
                    color={banner.isActive ? "success" : "default"}
                    size="small"
                />
            </TableCell>
            <TableCell sx={{ width: "160px" }}>
                {banner.image ? (
                    <Box
                        component="img"
                        src={`${API_URL}${banner.image}`}
                        alt={titleText}
                        sx={{
                            width: 120,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                        }}
                    />
                ) : (
                    "—"
                )}
            </TableCell>
            <TableCell sx={{ minWidth: "140px" }}>
                <ActionButtons
                    onEdit={() => onEdit(banner._id)}
                    onDelete={() => onDelete(banner._id)}
                    onToggleActive={() => onToggleActive(banner._id)}
                    isActive={banner.isActive}
                    isSmallScreen={isSmallScreen}
                    editButtonProps={{
                        size: "small",
                        sx: {
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            width: "100%",
                            mb: 0.5,
                        },
                    }}
                    deleteButtonProps={{
                        size: "small",
                        sx: {
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            width: "100%",
                            mb: 0.5,
                        },
                    }}
                    toggleButtonProps={{
                        size: "small",
                        sx: {
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            width: "100%",
                        },
                    }}
                />
            </TableCell>
        </TableRow>
    );
};

export default BannerTableRow;