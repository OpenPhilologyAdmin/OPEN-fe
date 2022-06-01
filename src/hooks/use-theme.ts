import { useContext } from "react";

import { ThemeContext } from "src/contexts/theme";

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () =>
    setTheme(previousTheme => (previousTheme === "LIGHT" ? "DARK" : "LIGHT"));

  return { theme, toggleTheme };
};
