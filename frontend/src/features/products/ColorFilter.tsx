import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  colors: string[];
  value: string[];
  onToggle: (color: string) => void;
}

const ColorFilter = ({colors, value, onToggle}: Props) => {
  return (
      <Accordion
          defaultExpanded
          sx={{boxShadow: "none", border: "1px solid #e0e0e0", mb: 2}}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant="subtitle1" sx={{fontWeight: 500}}>
            Цвет
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
            {colors.map((color) => {
              const selected = value.includes(color);

              return (
                  <Chip
                      key={color}
                      label={color}
                      onClick={() => onToggle(color)}
                      variant={selected ? "filled" : "outlined"}
                      sx={{
                        backgroundColor: selected ? "#660033" : "transparent",
                        color: selected ? "white" : "inherit",
                        borderColor: "#660033",
                        "&:hover": {
                          backgroundColor: selected
                              ? "#550022"
                              : "rgba(102, 0, 51, 0.08)",
                        },
                      }}
                  />
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
  );
};

export default ColorFilter;
