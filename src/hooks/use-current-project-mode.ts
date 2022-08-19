import { useContext } from "react";

import { CurrentProjectModeContext } from "src/contexts/current-project-mode";

export const useCurrentProjectMode = () => {
  const { mode, setMode } = useContext(CurrentProjectModeContext);

  const toggleMode = () => {
    setMode(previousMode => (previousMode === "READ" ? "EDIT" : "READ"));
  };

  return {
    mode,
    setMode,
    toggleMode,
  };
};
