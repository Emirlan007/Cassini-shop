import React from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileFiltersDrawer = ({ open, onClose, children }: Props) => {
  return (
      <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{ sx: { width: { xs: "100%", sm: 350 } } }}
      >
        <Box
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
        >
          <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#660033" }}>
              Фильтры
            </Typography>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {children}
          </Box>

          <Box sx={{ pt: 3, borderTop: "1px solid #e0e0e0" }}>
            <Button
                variant="contained"
                fullWidth
                onClick={onClose}
                sx={{
                  backgroundColor: "#660033",
                  "&:hover": { backgroundColor: "#550022" },
                }}
            >
              Применить
            </Button>
          </Box>
        </Box>
      </Drawer>
  );
};

export default MobileFiltersDrawer;
