import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

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

function useVariantsTabSelectedTokenContext() {
  const { tokenContextId, setTokenContextId } = useContext(TokenContext);

  return {
    tokenContextId,
    setTokenContextId,
  };
}

// TODO rename so that it is clear that this is a provider for the token context from variants tab
function TokenProvider({ initialToken, children }: PropsWithChildren<Props>) {
  const [tokenContextId, setTokenContextId] = useState<number | undefined>(initialToken);

  return (
    <TokenContext.Provider value={{ tokenContextId, setTokenContextId }}>
      {children}
    </TokenContext.Provider>
  );
}

export { TokenContext, TokenProvider, useVariantsTabSelectedTokenContext };
