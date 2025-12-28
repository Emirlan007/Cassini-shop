import { type ChangeEvent } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import FileInput from "../../../components/UI/FileInput/FileInput";
import { findClosestColor } from "../../../utils/colorNormalizer";
import { useTranslation } from "react-i18next";

interface MediaUploaderProps {
  images: (File | string)[];
  video?: File | string | null;
  colors: string[];
  imagesByColor?: Record<string, number[]>;
  onImagesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (image: File | string) => void;
  onToggleImageColor: (color: string, index: number, checked: boolean) => void;
}

const MediaUploader = ({
  images,
  colors,
  imagesByColor,
  onImagesChange,
  onVideoChange,
  onRemoveImage,
  onToggleImageColor,
}: MediaUploaderProps) => {
  const { t } = useTranslation();

  const getClothesColorName = (hex: string) => {
    const colorName = findClosestColor(hex);
    return t(`colors.${colorName}`);
  };

  return (
    <Stack spacing={2}>
      <FileInput label="Видео" name="video" onChange={onVideoChange} />

      <FileInput label="Изображения" name="images" onChange={onImagesChange} />

      {images.length > 0 && (
        <ImageList cols={10} rowHeight={164}>
          {images.map((image, index) => (
            <Stack key={index}>
              <ImageListItem>
                <img
                  src={
                    image instanceof File
                      ? URL.createObjectURL(image)
                      : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format`
                  }
                  srcSet={
                    image instanceof File
                      ? undefined
                      : `http://localhost:8000/${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`
                  }
                  alt={`Product ${index + 1}`}
                />
              </ImageListItem>
              <Button
                onClick={() => onRemoveImage(image)}
                color="error"
                variant="contained"
              >
                Удалить
              </Button>
            </Stack>
          ))}
        </ImageList>
      )}

      {images.length > 0 && colors.length > 0 && (
        <>
          {colors.map((color) => (
            <Stack key={color}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: "2rem",
                      height: "2rem",
                      background: color,
                      borderRadius: "50%",
                    }}
                  />
                  <Typography>{getClothesColorName(color)}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" flexWrap="wrap">
                {images.map((_, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={imagesByColor?.[color]?.includes(index) || false}
                        onChange={(e) =>
                          onToggleImageColor(color, index, e.target.checked)
                        }
                      />
                    }
                    label={`Изображение ${index + 1}`}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </>
      )}
    </Stack>
  );
};

export default MediaUploader;
