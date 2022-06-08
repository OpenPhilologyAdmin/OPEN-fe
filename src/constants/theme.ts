import { DefaultTheme } from "styled-components";

// ! Theme object needs to be replaced with real values and extended by additional fields OPLU-122
const LIGHT: DefaultTheme = {
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    circle: "50%",
  },
  colors: {
    backgroundPrimary: "#FFFFFF",
    backgroundSecondary: "#F4F4F4",
    textPrimary: "#FFFFFF",
    textSecondary: "#101521",
    textDimmed: "#868686",
    actionsPrimary: "#5D2DEF",
    actionsSecondary: "#FC6145",
    actionsDisabled: "#E1E1E1",
    error: "#CD0000",
    touched: "#101521",
    border: "#868686",
    focus: "#5D2DEF",
  },
};

// ! Currently unused
const DARK: DefaultTheme = {
  ...LIGHT,
};

export const THEME = { LIGHT, DARK };
