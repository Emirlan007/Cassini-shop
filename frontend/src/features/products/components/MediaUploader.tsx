import { type ChangeEvent } from "react";
import { Stack, Button, ImageList, ImageListItem } from "@mui/material";
import FilesInput from "../../../components/FilesInput/FilesInput";

interface Props {
  images: File[];
  video: File | null;
  onImagesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (image: File) => void;
}

const MediaUploader = ({
  images,
  video,
  onImagesChange,
  onVideoChange,
  onRemoveImage,
}: Props) => {
  return (
    <Stack spacing={2}>
      <FilesInput label="Видео" name="video" onChange={onVideoChange} />

      <Stack>
        <FilesInput
          label="Изображения"
          name="images"
          onChange={onImagesChange}
        />

        {images && images.length > 0 && (
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
                  color={"error"}
                  variant={"contained"}
                >
                  Удалить
                </Button>
              </Stack>
            ))}
          </ImageList>
        )}
      </Stack>
    </Stack>
  );
};

export default MediaUploader;
