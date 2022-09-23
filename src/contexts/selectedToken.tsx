import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

type TokenContextType = {
  tokenContextId?: number;
  setTokenContextId: Dispatch<SetStateAction<number | undefined>>;
};

type Props = {
  initialToken?: number;
};

const TokenContext = createContext<TokenContextType>({
  tokenContextId: undefined,
  setTokenContextId: () => {},
});

function TokenProvider({ initialToken, children }: PropsWithChildren<Props>) {
  const [tokenContextId, setTokenContextId] = useState<number | undefined>(initialToken);

  return (
    <TokenContext.Provider value={{ tokenContextId, setTokenContextId }}>
      {children}
    </TokenContext.Provider>
  );
}

export { TokenContext, TokenProvider };
