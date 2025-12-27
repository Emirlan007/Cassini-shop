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
  name: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "KG", name: "Кыргызстан", dialCode: "+996" },
  { code: "RU", name: "Россия", dialCode: "+7" },
  { code: "KZ", name: "Казахстан", dialCode: "+7" },
  { code: "UZ", name: "Узбекистан", dialCode: "+998" },
  { code: "TJ", name: "Таджикистан", dialCode: "+992" },
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
    const countryCode = e.target.value;
    const selectedCountry = countries.find((c) => c.code === countryCode);
    if (selectedCountry) {
      setCountry(selectedCountry);
      onChange(`${selectedCountry.dialCode}${phoneNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");

    let maxLength = 15;
    if (input.length > maxLength) {
      input = input.substring(0, maxLength);
    }

    setPhoneNumber(input);
    onChange(`${country.dialCode}${input}`);
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return "";

    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        8
      )} ${digits.slice(8, 10)}`;
    }
  };

  const translatedLabel = t(label);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Select
        value={country.code}
        onChange={handleCountryChange}
        sx={{
          minWidth: 120,
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
            {c.name} ({c.dialCode})
          </MenuItem>
        ))}
      </Select>

      <TextField
        label={translatedLabel}
        value={formatPhoneNumber(phoneNumber)}
        onChange={handlePhoneChange}
        fullWidth
        required={required}
        error={error}
        helperText={helperText}
        placeholder="XXX XXX XX XX"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#F5F5F5",
            height: "56px",
            padding: "0 17px",
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
