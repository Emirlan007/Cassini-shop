import { Button, type ButtonProps, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  isActive: boolean;
  isSmallScreen?: boolean;
  editButtonProps?: ButtonProps;
  deleteButtonProps?: ButtonProps;
  toggleButtonProps?: ButtonProps;
}

const ActionButtons = ({
  onEdit,
  onDelete,
  onToggleActive,
  isActive,
  isSmallScreen = false,
  editButtonProps,
  deleteButtonProps,
  toggleButtonProps,
}: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={1}>
      <Button
        variant="outlined"
        startIcon={!isSmallScreen}
        onClick={onEdit}
        size="small"
        {...editButtonProps}
        sx={{
          color: "#660033",
          borderColor: "#660033",
          "&:hover": {
            backgroundColor: "rgba(102, 0, 51, 0.04)",
            borderColor: "#660033",
          },
          ...editButtonProps?.sx,
        }}
      >
        {isSmallScreen ? t("buttons.editShort") : t("buttons.edit")}
      </Button>

      <Button
        variant="outlined"
        onClick={onDelete}
        size="small"
        {...deleteButtonProps}
        sx={{
          color: "#F0544F",
          borderColor: "#F0544F",
          "&:hover": {
            backgroundColor: "rgba(240, 84, 79, 0.04)",
            borderColor: "#F0544F",
          },
          ...deleteButtonProps?.sx,
        }}
      >
        {isSmallScreen ? t("buttons.deleteShort") : t("buttons.delete")}
      </Button>

      <Button
        variant="outlined"
        onClick={onToggleActive}
        size="small"
        {...toggleButtonProps}
        sx={{
          color: "#660033",
          borderColor: "#660033",
          "&:hover": {
            backgroundColor: "rgba(102, 0, 51, 0.04)",
            borderColor: "#660033",
          },
          ...toggleButtonProps?.sx,
        }}
      >
        {isSmallScreen
          ? isActive
            ? t("buttons.deleteShort")
            : t("buttons.editShort")
          : t("buttons.toggleActive")}
      </Button>
    </Stack>
  );
};

export default ActionButtons;
