import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UserCommentFormProps {
  onSubmit: (comment: string) => void;
  loading: boolean;
}

const UserCommentForm = ({ onSubmit, loading }: UserCommentFormProps) => {
  const [comment, setComment] = useState("");

  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(comment);
    setComment("");
  };

  return (
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
        placeholder={t("orderComment")}
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={comment.trim() === "" || loading}
      >
        {loading ? <CircularProgress size={20} /> : t("send")}
      </Button>
    </Stack>
  );
};

export default UserCommentForm;
