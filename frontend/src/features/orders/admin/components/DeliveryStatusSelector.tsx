import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DeliveryStatus } from "../../../../constants";
import React from "react";

interface Props {
  deliveryStatus: string;
  setDeliveryStatus: (status: string) => void;
  currentDeliveryStatus: string;
  onSubmit: (status: string) => void;
}

const DeliveryStatusSelector: React.FC<Props> = ({
  deliveryStatus,
  setDeliveryStatus,
  currentDeliveryStatus,
  onSubmit,
}) => {
  return (
    <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление статусом доставки
      </Typography>

      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус доставки</InputLabel>
          <Select
            value={deliveryStatus}
            label="Статус доставки"
            onChange={(e) => setDeliveryStatus(e.target.value)}
          >
            {Object.keys(DeliveryStatus).map((item: string) => (
              <MenuItem
                key={item}
                value={DeliveryStatus[item as keyof typeof DeliveryStatus]}
              >
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={() => deliveryStatus && onSubmit(deliveryStatus)}
          disabled={!deliveryStatus || deliveryStatus === currentDeliveryStatus}
        >
          Обновить
        </Button>
      </Box>
    </Box>
  );
};

export default DeliveryStatusSelector;
