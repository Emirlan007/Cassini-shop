import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
      contrastText: "#000000",
    },
    secondary: {
      main: "#660033",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7F7F7",
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
    },
    action: {
      active: "#F0544F",
      hover: "#f58784",
      selected: "#f3a29f",
      disabled: "#f0544f33",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#FFFFFF",
          backgroundColor: "#660033",
        },
        outlined: {
          color: "#FFFFFF",
        },
        text: {
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#0000001a",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f1057b",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F0544F",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F0544F",
            borderWidth: "2px",
          },
        },
        input: {
          color: "#660033",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#660033",
          "&.Mui-focused": {
            color: "#F0544F",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#800643",
          "&.Mui-checked": {
            color: "#F0544F",
          },
        },
      },
    },
  },
});

export default theme;
