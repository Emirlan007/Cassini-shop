import { Box, Stack, Typography } from "@mui/material";
import type React from "react";

interface Props {
  userComment: string;
  adminComments?: string[];
}

const OrderCardComments: React.FC<Props> = ({ userComment, adminComments }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {userComment && userComment.trim() !== "" && (
        <Stack>
          <Typography variant="body1">Комментарий</Typography>
          <Typography
            variant="body2"
            sx={{
              background: "#dddddd",
              borderRadius: 1,
              p: 0.5,
            }}
          >
            {userComment}
          </Typography>
        </Stack>
      )}

      {adminComments && adminComments.length > 0 && (
        <Stack>
          <Typography variant="body1">Комментарии админа</Typography>
          {adminComments.map((comment) => (
            <Typography
              variant="body2"
              key={comment}
              sx={{
                background: "#dddddd",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              {comment}
            </Typography>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default OrderCardComments;
