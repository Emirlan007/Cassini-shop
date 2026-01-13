import { Box, TableCell, Tooltip, Typography } from "@mui/material";
import type React from "react";

interface Props {
  imageUrl?: string;
  alt?: string;
}

const TableThumbnail: React.FC<Props> = ({ imageUrl, alt }) => {
  return (
    <TableCell
      padding="none"
      align="center"
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        sx={{
          display: "flex",
          p: 0.5,
        }}
      >
        {imageUrl ? (
          <Tooltip
            title={
              <img
                src={imageUrl}
                alt={alt}
                style={{
                  height: 300,
                  objectFit: "contain",
                }}
              />
            }
            placement="right"
            arrow
          >
            <img
              src={imageUrl}
              alt={alt}
              style={{
                width: 60,
                height: 60,
                borderRadius: 3,
                objectFit: "cover",
              }}
            />
          </Tooltip>
        ) : (
          <Typography variant="body2">Нет фото</Typography>
        )}
      </Box>
    </TableCell>
  );
};

export default TableThumbnail;
