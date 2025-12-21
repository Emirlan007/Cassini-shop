import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  value: [number, number];
  min: number;
  max: number;
  onChange: (value: [number, number]) => void;
  onCommit: (value: [number, number]) => void;
}

const PriceFilter = ({value, min, max, onChange, onCommit}: Props) => {
  return (
      <Accordion
          defaultExpanded
          sx={{
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            mb: 2,
            "&:before": {display: "none"},
          }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant="subtitle1" sx={{fontWeight: 500}}>
            Цена
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Slider
              value={value}
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  onChange([newValue[0], newValue[1]]);
                }
              }}
              onChangeCommitted={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  onCommit([newValue[0], newValue[1]]);
                }
              }}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              sx={{
                color: "#660033",
                "& .MuiSlider-thumb": {
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px rgba(102, 0, 51, 0.16)",
                  },
                },
              }}
          />

          <Box sx={{display: "flex", justifyContent: "space-between", mt: 1}}>
            <Typography variant="body2" color="text.secondary">
              {value[0]} сом
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {value[1]} сом
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
  );
};

export default PriceFilter;
