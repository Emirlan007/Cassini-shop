import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import type { BannerInput } from "../../../types";
import { fetchBanners } from "../bannersThunks";
import { createBanner } from "./BannersThunks";
import BannerForm from "./components/BannerForm";
import { selectCreateBannerLoading } from "../bannersSlice";

const CreateBanner = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectCreateBannerLoading);

  const onFormSubmit = async (data: BannerInput) => {
    await dispatch(
        createBanner({
          title: data.title,
          description: data.description,
          link: data.link,
          image: data.image!,
        })
    ).unwrap();

    dispatch(fetchBanners());
    navigate("/");
  };

  return (
      <>
        <BannerForm onSubmit={onFormSubmit} loading={creating} />
      </>
  );
};

export default CreateBanner;
