import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { BannerInput } from "../../../../types";

interface Props {
  onSubmit: (data: BannerInput) => void;
  loading: boolean;
}

const BannerForm = ({ onSubmit, loading }: Props) => {
  const [state, setState] = useState<BannerInput>({
    title: "",
    description: "",
    link: "",
    image: null,
  });

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setState(prev => ({ ...prev, image: file }));
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(state);
  };

  return (
      <Stack spacing={2} component="form" onSubmit={submitHandler} sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
          Создать баннер
        </Typography>

        <TextField name="title" label="Название баннера *" value={state.title} onChange={changeHandler} required />
        <TextField name="description" label="Описание" value={state.description} onChange={changeHandler} multiline minRows={3} />
        <TextField name="link" label="Ссылка" value={state.link} onChange={changeHandler} />

        <Box>
          <Typography sx={{ mb: 1 }}>Изображение *</Typography>
          <input type="file" accept="image/*" onChange={imageHandler} />
          {state.image && <Typography sx={{ fontSize: 13, mt: 1 }}>{state.image.name}</Typography>}
        </Box>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Создание..." : "Создать"}
        </Button>
      </Stack>
  );
};

export default BannerForm;
