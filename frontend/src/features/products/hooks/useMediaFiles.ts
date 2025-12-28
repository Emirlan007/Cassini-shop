import { type ChangeEvent } from "react";

const MAX_IMAGES = 10;

export const useMediaFiles = (
  setState: React.Dispatch<React.SetStateAction<any>>
) => {
  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    const newFiles = Array.from(files);

    setState((prev: any) => {
      const existing = prev[name] || [];
      if (existing.length >= MAX_IMAGES) return prev;

      const availableSlots = MAX_IMAGES - existing.length;
      const filesToAdd = newFiles.slice(0, availableSlots);

      return {
        ...prev,
        [name]: [...existing, ...filesToAdd],
      };
    });
  };

  const videoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState((prev: any) => ({
      ...prev,
      video: file,
    }));
  };

  const removeImageHandler = (image: File | string) => {
    setState((prev: any) => {
      const removedIndex = prev.images.indexOf(image);

      const updatedImagesByColor = Object.fromEntries(
        Object.entries(prev.imagesByColor).map(([color, indexes]) => [
          color,
          (indexes as number[])
            .filter((i) => i !== removedIndex)
            .map((i) => (i > removedIndex ? i - 1 : i)),
        ])
      );

      return {
        ...prev,
        images: prev.images.filter((i: File | string) => i !== image),
        imagesByColor: updatedImagesByColor,
      };
    });
  };

  return {
    fileInputChangeHandler,
    videoChangeHandler,
    removeImageHandler,
  };
};
