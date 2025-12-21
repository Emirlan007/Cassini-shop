import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import ColorsModal from "../../../components/UI/ColorsModal/ColorsModal";

interface Props {
  selectedColors: string[];
  onColorUpdate: (value: string, checked: boolean) => void;
}

const ColorsSelector = ({ selectedColors, onColorUpdate }: Props) => {
  const [isColorsOpen, setColorsOpen] = useState(false);

  return (
    <>
      <ColorsModal
        open={isColorsOpen}
        onClose={() => setColorsOpen(false)}
        colors={selectedColors}
        onChange={onColorUpdate}
      />
      <Stack direction="row" spacing={2} alignItems={"center"}>
        <TextField
          sx={{ width: "100%" }}
          label="Выбранные расцветки"
          value={selectedColors.join(", ")}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="contained" onClick={() => setColorsOpen(true)}>
          Расцветки
        </Button>
      </Stack>
    </>
  );
};

export default ColorsSelector;
