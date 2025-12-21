import { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCreateUserCommentLoading } from "../ordersSlice";
import { addUserCommentToOrder, fetchOrderById } from "../ordersThunk";

interface Props {
  orderId: string;
}

const UserCommentForm = ({ orderId }: Props) => {
  const dispatch = useAppDispatch();
  const [userComment, setUserComment] = useState("");
  const createUserCommentLoading = useAppSelector(
    selectCreateUserCommentLoading
  );

  const handleUserCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await dispatch(addUserCommentToOrder({ comment: userComment, orderId }));
    await dispatch(fetchOrderById(orderId));
    setUserComment("");
  };

  return (
    <Stack
      onSubmit={handleUserCommentSubmit}
      component="form"
      direction="row"
      spacing={1}
      mt={3}
    >
      <TextField
        value={userComment}
        onChange={(e) => setUserComment(e.target.value)}
        placeholder="Комментарий к заказу"
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={userComment.trim() === ""}
      >
        {createUserCommentLoading ? (
          <CircularProgress size={20} />
        ) : (
          "Отправить"
        )}
      </Button>
    </Stack>
  );
};

export default UserCommentForm;
