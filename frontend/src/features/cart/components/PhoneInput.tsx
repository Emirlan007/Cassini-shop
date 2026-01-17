import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Country {
  code: string;
  dialCode: string;
  format: (digits: string) => string;
  maxLength: number;
}

const countries: Country[] = [
  {
    code: "KG",
    dialCode: "+996",
    maxLength: 9,
    format: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
    },
  },
  {
    code: "RU",
    dialCode: "+7",
    maxLength: 10,
    format: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      if (d.length <= 8)
        return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(
        8,
        10
      )}`;
    },
  },
  {
    code: "KZ",
    dialCode: "+7",
    maxLength: 10,
    format: (d) => {
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      if (d.length <= 8)
        return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(
        8,
        10
      )}`;
    },
  },
  {
    code: "UZ",
    dialCode: "+998",
    maxLength: 9,
    format: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      if (d.length <= 7)
        return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(
        7,
        9
      )}`;
    },
  },
  {
    code: "TJ",
    dialCode: "+992",
    maxLength: 9,
    format: (d) => {
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      if (d.length <= 7)
        return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(
        7,
        9
      )}`;
    },
  },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
}

const PhoneInput = ({
  value,
  onChange,
  error,
  helperText,
  label = "phoneNumber",
  required = false,
}: PhoneInputProps) => {
  const [country, setCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    if (value) {
      const foundCountry = countries.find((c) => value.startsWith(c.dialCode));
      if (foundCountry) {
        setCountry(foundCountry);
        setPhoneNumber(value.replace(foundCountry.dialCode, ""));
      } else {
        if (value.startsWith("+")) {
          const withoutPlus = value.substring(1);
          setPhoneNumber(withoutPlus);
        } else {
          setPhoneNumber(value);
        }
      }
    }
  }, [value]);

  const handleCountryChange = (e: SelectChangeEvent) => {
    const selectedCountry = countries.find((c) => c.code === e.target.value);

    if (!selectedCountry) return;

    setCountry(selectedCountry);

    const trimmed = phoneNumber.slice(0, selectedCountry.maxLength);
    setPhoneNumber(trimmed);

    onChange(`${selectedCountry.dialCode}${trimmed}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");

    if (digits.length > country.maxLength) {
      digits = digits.slice(0, country.maxLength);
    }

    setPhoneNumber(digits);
    onChange(`${country.dialCode}${digits}`);
  };

  const translatedLabel = t(label);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Select
        value={country.code}
        onChange={handleCountryChange}
        renderValue={(selected) => {
          const c = countries.find((c) => c.code === selected);
          return c ? c.dialCode : "";
        }}
        sx={{
          minWidth: 100,
          height: 56,
          borderRadius: "12px",
          backgroundColor: "#F5F5F5",
          "& fieldset": {
            border: "2px solid #F5F5F5",
          },
          "&:hover fieldset": {
            borderColor: "#d8d7d7",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#b3b0b0 !important",
          },
        }}
      >
        {countries.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            {c.code} ({c.dialCode})
          </MenuItem>
        ))}
      </Select>

      <TextField
        label={translatedLabel}
        name="phoneNumber"
        value={country.format(phoneNumber)}
        onChange={handlePhoneChange}
        fullWidth
        required={required}
        error={error}
        helperText={helperText}
        slotProps={{
          formHelperText: {
            "data-testid": "phone-number-error",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#F5F5F5",
            height: "56px",
            padding: "0 17px",
            p: 0,
            "& fieldset": {
              border: "2px solid #F5F5F5",
            },
            "&:hover fieldset": {
              borderColor: "#d8d7d7",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#b3b0b0 !important",
            },
          },
        }}
      />
    </Box>
  );
};

export default PhoneInput;
