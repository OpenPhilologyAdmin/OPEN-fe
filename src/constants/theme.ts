import { DefaultTheme } from "styled-components";

// ! Theme object needs to be replaced with real values and extended by additional fields
const LIGHT: DefaultTheme = {
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    circle: "50%",
  },
  colors: {
    textPrimary: "#FFFFFF",
    textSecondary: "#101521",
  },
};

// ! Currently unused
const DARK: DefaultTheme = {
  ...LIGHT,
};

export const THEME = { LIGHT, DARK };
