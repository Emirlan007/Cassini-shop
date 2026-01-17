import { type ChangeEvent, type FC, useRef, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  multiple?: boolean;
}

const FileInput: FC<Props> = ({ onChange, name, label, multiple = false }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { t } = useTranslation();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const namesArray = Array.from(files).map((file) => file.name);
      setFileNames(namesArray);
    } else {
      setFileNames([]);
    }

    onChange(e);
  };

  const activateInput = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        name={name}
        ref={inputRef}
        onChange={onFileChange}
        multiple={multiple}
        data-testid="image-input"
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          required
          sx={{ width: "100%", mr: 2 }}
          slotProps={{ input: { readOnly: true } }}
          label={label}
          value={fileNames.join(", ")}
          onClick={activateInput}
        />

        <Button
          color="success"
          variant="contained"
          onClick={activateInput}
          sx={{ width: { xs: "100%", sm: "20%", md: "15%" } }}
        >
          {t("browse")}
        </Button>
      </Stack>
    </>
  );
};

export default FileInput;
