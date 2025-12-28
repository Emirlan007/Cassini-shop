import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface AdminCommentFormProps {
  onSubmit: (comment: string) => void;
  loading: boolean;
  existingComments?: string[];
}

const AdminCommentForm = ({
  onSubmit,
  loading,
  existingComments = [],
}: AdminCommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(comment);
    setComment("");
  };

  return (
    <>
      {existingComments.length > 0 && (
        <Stack mt={3}>
          <Typography variant="h6">Комментарии админа</Typography>
          {existingComments.map((comment) => (
            <Typography
              variant="body1"
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

      <Stack
        onSubmit={handleSubmit}
        component="form"
        direction="row"
        spacing={1}
        mt={3}
      >
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий к заказу"
          sx={{ flexGrow: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={comment.trim() === "" || loading}
        >
          {loading ? <CircularProgress size={20} /> : "Отправить"}
        </Button>
      </Stack>
    </>
  );
};

export default AdminCommentForm;
