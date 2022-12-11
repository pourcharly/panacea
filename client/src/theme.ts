import { createTheme, ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
  palette: {
    // type: 'light',
    primary: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#a5d6a7',
    },
    secondary: {
      main: '#ffab00',
      light: '#ffe57f',
    },
    background: {
      default: '#a6ecb9',
      paper: '#ffffff',
    },
  },
};

export const theme = createTheme(themeOptions);