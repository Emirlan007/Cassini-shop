import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../users/usersSlice";
import { selectWishlistProductIds } from "../../wishlist/wishlistSlice";
import toast from "react-hot-toast";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../wishlist/wishlistThunks";
import { useTranslation } from "react-i18next";

export const useWishlist = (productId: string) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const wishlistIds = useAppSelector(selectWishlistProductIds);

  const { t } = useTranslation();

  const isInWishlist = wishlistIds.includes(productId);

  const toggleWishlist = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user) {
      toast.error(t("logInToAddItemsToWishlist"));
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success(t("itemRemovedFromWishlist"));
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success(t("itemAddedToWishlist"));
      }
    } catch {
      toast.error("Произошла ошибка");
    }
  };

  return { isInWishlist, toggleWishlist };
};
