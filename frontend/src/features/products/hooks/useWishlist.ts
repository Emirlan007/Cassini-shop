import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../users/usersSlice";
import { selectWishlistProductIds } from "../../wishlist/wishlistSlice";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../wishlist/wishlistThunks";

export const useWishlist = (productId: string) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const wishlistIds = useAppSelector(selectWishlistProductIds);

  const isInWishlist = wishlistIds.includes(productId);

  const toggleWishlist = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user) {
      toast.error("Войдите в аккаунт, чтобы добавить товар в избранное");
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Товар удален из избранного");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success("Товар добавлен в избранное");
      }
    } catch {
      toast.error("Произошла ошибка");
    }
  };

  return { isInWishlist, toggleWishlist };
};
