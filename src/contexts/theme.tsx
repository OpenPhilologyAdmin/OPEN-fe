import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

import { THEME } from "@/constants/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

type ThemeVariant = "LIGHT" | "DARK";

type ThemeContextType = {
  theme: ThemeVariant;
  setTheme: Dispatch<SetStateAction<ThemeVariant>>;
};

type Props = {
  initialTheme: ThemeVariant;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "LIGHT",
  setTheme: () => {},
});

function ThemeProvider({ initialTheme, children }: PropsWithChildren<Props>) {
  const [themeState, setTheme] = useState<ThemeVariant>(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme: themeState, setTheme }}>
      <StyledThemeProvider theme={THEME[themeState]}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
