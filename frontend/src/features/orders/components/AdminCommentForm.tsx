import { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCreateAdminCommentLoading } from "../admin/ordersSlice";
import { addAdminCommentToOrder } from "../admin/ordersThunks";
import { fetchOrderById } from "../ordersThunk";

interface Props {
  orderId: string;
}

const AdminCommentForm = ({ orderId }: Props) => {
  const dispatch = useAppDispatch();
  const [adminComment, setAdminComment] = useState("");
  const createAdminCommentLoading = useAppSelector(
    selectCreateAdminCommentLoading
  );

  const handleAdminCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await dispatch(addAdminCommentToOrder({ comment: adminComment, orderId }));
    await dispatch(fetchOrderById(orderId));
    setAdminComment("");
  };

  return (
    <Stack
      onSubmit={handleAdminCommentSubmit}
      component="form"
      direction="row"
      spacing={1}
      mt={3}
    >
      <TextField
        value={adminComment}
        onChange={(e) => setAdminComment(e.target.value)}
        placeholder="Комментарий к заказу"
        sx={{ flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={adminComment.trim() === ""}
      >
        {createAdminCommentLoading ? (
          <CircularProgress size={20} />
        ) : (
          "Отправить"
        )}
      </Button>
    </Stack>
  );
};

export default AdminCommentForm;
