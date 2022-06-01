import { DefaultTheme } from "styled-components";

// ! Theme object needs to be replaced with real values and extended by additional fields
const LIGHT: DefaultTheme = {
  borderRadius: "5px",
  colors: {
    main: "black",
    secondary: "white",
  },
};

// ! Currently unused
const DARK: DefaultTheme = {
  ...LIGHT,
};

export const THEME = { LIGHT, DARK };
