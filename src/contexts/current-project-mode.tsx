import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

export type Mode = "READ" | "EDIT";

type CurrentProjectModeContextType = {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
};

type Props = {
  initialMode: Mode;
};

const CurrentProjectModeContext = createContext<CurrentProjectModeContextType>({
  mode: "READ",
  setMode: () => {},
});

function CurrentProjectModeProvider({ initialMode, children }: PropsWithChildren<Props>) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <CurrentProjectModeContext.Provider value={{ mode, setMode }}>
      {children}
    </CurrentProjectModeContext.Provider>
  );
}

export { CurrentProjectModeContext, CurrentProjectModeProvider };
