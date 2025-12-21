import { type ChangeEvent } from "react";

const MAX_IMAGES = 10;

export const useMediaFiles = () => {
  const handleImagesChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentImages: File[],
    setState: (updater: (prev: any) => any) => void
  ) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    setState((prev: any) => {
      const existing = prev[name] || [];

      if (existing.length >= MAX_IMAGES) {
        alert(`Максимум можно загрузить ${MAX_IMAGES} изображений.`);
        return prev;
      }

      const availableSlots = MAX_IMAGES - existing.length;
      const filesToAdd = newFiles.slice(0, availableSlots);

      return {
        ...prev,
        [name]: [...existing, ...filesToAdd],
      };
    });
  };

  const handleVideoChange = (
    e: ChangeEvent<HTMLInputElement>,
    setState: (updater: (prev: any) => any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState((prev: any) => ({
      ...prev,
      video: file,
    }));
  };

  const removeImage = (
    image: File,
    setState: (updater: (prev: any) => any) => void
  ) => {
    setState((prevState: any) => ({
      ...prevState,
      images:
        prevState.images && prevState.images.filter((i: File) => i !== image),
    }));
  };

  return {
    handleImagesChange,
    handleVideoChange,
    removeImage,
    MAX_IMAGES,
  };
};
