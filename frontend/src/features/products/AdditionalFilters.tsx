import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  value: {
    inStock?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
  };
  onToggle: (
      key: "inStock" | "isNew" | "isPopular",
      checked: boolean
  ) => void;
}

const AdditionalFilters = ({value, onToggle}: Props) => {
  return (
      <Accordion
          defaultExpanded={false}
          sx={{boxShadow: "none", border: "1px solid #e0e0e0"}}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant="subtitle1" sx={{fontWeight: 500}}>
            Дополнительно
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
                control={
                  <Checkbox
                      checked={!!value.inStock}
                      onChange={(e) =>
                          onToggle("inStock", e.target.checked)
                      }
                      sx={{
                        color: "#660033",
                        "&.Mui-checked": {color: "#660033"},
                      }}
                  />
                }
                label="В наличии"
            />

            <FormControlLabel
                control={
                  <Checkbox
                      checked={!!value.isNew}
                      onChange={(e) =>
                          onToggle("isNew", e.target.checked)
                      }
                      sx={{
                        color: "#660033",
                        "&.Mui-checked": {color: "#660033"},
                      }}
                  />
                }
                label="Новинки"
            />

            <FormControlLabel
                control={
                  <Checkbox
                      checked={!!value.isPopular}
                      onChange={(e) =>
                          onToggle("isPopular", e.target.checked)
                      }
                      sx={{
                        color: "#660033",
                        "&.Mui-checked": {color: "#660033"},
                      }}
                  />
                }
                label="Популярные"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
  );
};

export default AdditionalFilters;
