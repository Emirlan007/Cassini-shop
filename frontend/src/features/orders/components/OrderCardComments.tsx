import { Box, Stack, Typography } from "@mui/material";
import type React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  userComment: string;
  adminComments?: string[];
}

const OrderCardComments: React.FC<Props> = ({ userComment, adminComments }) => {
  const { t } = useTranslation();
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
          <Typography variant="body1"> {t("comment")}</Typography>
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
