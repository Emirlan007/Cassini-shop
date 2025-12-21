import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import SizesModal from "../../../components/UI/SizesModal/SizesModal";

interface Props {
  selectedSizes: string[];
  onSizeUpdate: (value: string, checked: boolean) => void;
}

const SizesSelector = ({ selectedSizes, onSizeUpdate }: Props) => {
  const [isSizesOpen, setSizesOpen] = useState(false);

  return (
    <>
      <SizesModal
        open={isSizesOpen}
        onClose={() => setSizesOpen(false)}
        sizes={selectedSizes}
        onChange={onSizeUpdate}
      />
      <Stack direction="row" spacing={2} alignItems={"center"}>
        <TextField
          sx={{ width: "100%" }}
          label="Выбранные размеры"
          value={
            selectedSizes.length > 0
              ? selectedSizes.join(", ")
              : "No sizes selected"
          }
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="contained" onClick={() => setSizesOpen(true)}>
          Размеры
        </Button>
      </Stack>
    </>
  );
};

export default SizesSelector;
