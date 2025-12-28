import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import SizesModal from "../../../components/UI/SizesModal/SizesModal";

interface SizesSelectorProps {
  sizes: string[];
  onSizeUpdate: (value: string, checked: boolean) => void;
}

const SizesSelector = ({ sizes, onSizeUpdate }: SizesSelectorProps) => {
  const [isSizesOpen, setSizesOpen] = useState(false);

  return (
    <>
      <SizesModal
        open={isSizesOpen}
        onClose={() => setSizesOpen(false)}
        sizes={sizes}
        onChange={onSizeUpdate}
      />

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          sx={{ width: "100%" }}
          label="Выбранные размеры"
          value={sizes.length ? sizes.join(", ") : "No sizes selected"}
          InputProps={{ readOnly: true }}
        />
        <Button variant="contained" onClick={() => setSizesOpen(true)}>
          Размеры
        </Button>
      </Stack>
    </>
  );
};

export default SizesSelector;
