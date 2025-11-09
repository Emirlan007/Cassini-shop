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
      primary: "#660033",
      secondary: "#000000",
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
          backgroundColor: "#F0544F",
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
  },
});

export default theme;
