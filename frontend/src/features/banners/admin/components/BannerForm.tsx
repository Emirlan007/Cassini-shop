import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import type { Banner, BannerInput } from "../../../../types";
import FileInput from "../../../../components/UI/FileInput/FileInput.tsx";
import { API_URL } from "../../../../constants.ts";
import { useTranslation } from "react-i18next";

interface Props {
  onSubmit: (data: BannerInput) => void;
  loading: boolean;
  existingBanner?: Banner | null;
  isEdit?: boolean;
}

const BannerForm = ({
  onSubmit,
  loading,
  existingBanner,
  isEdit = false,
}: Props) => {
  const { t } = useTranslation();
  const [state, setState] = useState<BannerInput>({
    title: "",
    description: "",
    link: "",
    image: null,
  });

  useEffect(() => {
    if (existingBanner) {
      setState({
        title: existingBanner.title,
        description: existingBanner.description || "",
        link: existingBanner.link || "",
        image: null,
      });
    }
  }, [existingBanner]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setState((prev) => ({ ...prev, image: file }));
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(state);
  };

  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={submitHandler}
      sx={{ maxWidth: 650, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        {isEdit
          ? t("buttons.edit") + " " + t("admin.banners").toLowerCase()
          : t("buttons.createCategory")}
      </Typography>

      <TextField
        name="title"
        label={t("forms.bannerName")}
        value={state.title}
        onChange={changeHandler}
        required
      />
      <TextField
        name="description"
        label={t("forms.description")}
        value={state.description}
        onChange={changeHandler}
        multiline
        minRows={3}
      />
      <TextField
        name="link"
        label={t("forms.link")}
        value={state.link}
        onChange={changeHandler}
      />

      <Box>
        <FileInput
          label={t("forms.image")}
          name="image"
          onChange={imageHandler}
        />
        {state.image && (
          <Typography sx={{ fontSize: 13, mt: 1 }}>
            {state.image.name}
          </Typography>
        )}
        {isEdit && existingBanner?.image && !state.image && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Текущее изображение:
            </Typography>
            <img
              src={`${API_URL}${existingBanner.image.replace("public/", "")}`}
              alt="Current banner"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </Box>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ bgcolor: "#660033" }}
      >
        {loading
          ? isEdit
            ? "Обновление..."
            : "Создание..."
          : isEdit
            ? "Обновить"
            : "Создать"}
      </Button>
    </Stack>
  );
};

export default BannerForm;
