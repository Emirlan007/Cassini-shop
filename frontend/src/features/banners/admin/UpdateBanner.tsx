import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    selectBanner,
    selectFetchBannerLoading,
    selectUpdateBannerLoading,
    clearBanner
} from "../bannersSlice";
import type { BannerInput } from "../../../types";
import BannerForm from "./components/BannerForm";
import { Alert, CircularProgress, Box } from "@mui/material";
import {fetchBannerById, updateBanner} from "./BannersThunks.ts";

const UpdateBanner = () => {
    const { bannerId } = useParams<{ bannerId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const banner = useAppSelector(selectBanner);
    const fetchLoading = useAppSelector(selectFetchBannerLoading);
    const updateLoading = useAppSelector(selectUpdateBannerLoading);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (bannerId) {
            dispatch(fetchBannerById(bannerId));
        }

        return () => {
            dispatch(clearBanner());
        };
    }, [dispatch, bannerId]);

    const onFormSubmit = async (data: BannerInput) => {
        if (!bannerId) return;

        try {
            await dispatch(
                updateBanner({
                    id: bannerId,
                    data: {
                        title: data.title,
                        description: data.description,
                        link: data.link,
                        image: data.image,
                    },
                })
            ).unwrap();

            navigate("/"); //куда нужно после обновления
        } catch (error) {
            setError("Failed to update banner");
        }
    };

    if (fetchLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!banner && !fetchLoading) {
        return <Alert severity="error">Banner not found</Alert>;
    }

    return (
        <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <BannerForm
                onSubmit={onFormSubmit}
                loading={updateLoading}
                existingBanner={banner} // Передаем существующий баннер для предзаполнения формы
                isEdit={true}
            />
        </>
    );
};

export default UpdateBanner;