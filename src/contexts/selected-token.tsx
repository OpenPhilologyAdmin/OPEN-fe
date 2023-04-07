import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TokenContextType = {
  variantsTabTokenContextId?: number;
  setVariantsTabTokenContextId: Dispatch<SetStateAction<number | undefined>>;
};

type Props = {
  initialToken?: number;
};

const TokenContext = createContext<TokenContextType>({
  variantsTabTokenContextId: undefined,
  setVariantsTabTokenContextId: () => {},
});

function useVariantsTabSelectedTokenContext() {
  const { variantsTabTokenContextId, setVariantsTabTokenContextId } = useContext(TokenContext);

  return {
    variantsTabTokenContextId,
    setVariantsTabTokenContextId,
  };
}

function TokenProvider({ initialToken, children }: PropsWithChildren<Props>) {
  const [variantsTabTokenContextId, setVariantsTabTokenContextId] = useState<number | undefined>(
    initialToken,
  );

  return (
    <TokenContext.Provider value={{ variantsTabTokenContextId, setVariantsTabTokenContextId }}>
      {children}
    </TokenContext.Provider>
  );
}

export { TokenContext, TokenProvider, useVariantsTabSelectedTokenContext };
