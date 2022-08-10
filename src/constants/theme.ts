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
    textTertiary: "#868686",
    textDimmed: "#ABABAB",
    actionsPrimary: "#5D2DEF",
    actionsSecondary: "#FC6145",
    actionsDisabled: "#E1E1E1",
    error: "#CD0000",
    touched: "#101521",
    borderPrimary: "#868686",
    focusShadow: "0 0 0 4px rgba(93, 45, 239, 0.32)",
    focus: "rgba(93, 45, 239, 0.32)",
    borderSecondary: "#E1E1E1",
    tableRowActiveBackground: "#F1ECFF",
  },
};

// ! Currently unused
const DARK: DefaultTheme = {
  ...LIGHT,
};

export const THEME = { LIGHT, DARK };
