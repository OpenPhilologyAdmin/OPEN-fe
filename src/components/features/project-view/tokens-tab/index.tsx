import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import BaseToken from "@/components/ui/token";
import styled from "styled-components";

type TokensTabErrorPros = {
  refetch: () => Promise<any>;
};

export type TokensTabProps = {
  projectId: number;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  tokens?: API.Token[];
  refetch: () => Promise<any>;
  handleSelectToken: (selectedToken: API.Token) => void;
  determineIfTokenIsSelected: (token: API.Token) => boolean;
};

const BOTTOM_BAR_HEIGHT = 72;

const SelectionWrapper = styled.div`
  overflow-x: hidden;
  padding: 24px;
  z-index: 0;
  height: calc(100% - ${BOTTOM_BAR_HEIGHT}px);
`;

const Token = styled(BaseToken)`
  user-select: none;
`;

function TokensTabLoader() {
  const { t } = useTranslation();

  return <MaskLoader text={t("project.loader_text")} withBackgroundMask />;
}

function TokensTabError({ refetch }: TokensTabErrorPros) {
  const { t } = useTranslation();

  return (
    <MaskError
      text={t("project.generic_error")}
      buttonText={t("project.refresh")}
      refetch={refetch}
      withBackgroundMask
    />
  );
}

function TokensTab({
  tokens,
  isError,
  isLoading,
  isRefetching,
  isFetching,
  determineIfTokenIsSelected,
  refetch,
  handleSelectToken,
}: TokensTabProps) {
  if (isLoading && !tokens) return <TokensTabLoader />;

  if (isError && !isRefetching) return <TokensTabError refetch={refetch} />;

  if (!tokens) return null;

  return (
    <>
      <SelectionWrapper>
        {(isFetching || isRefetching) && <TokensTabLoader />}
        {isError && !isRefetching && <TokensTabError refetch={refetch} />}
        {tokens.map(token => (
          <Token
            data-testid="token"
            key={token.id}
            token={token}
            apparatusIndexVisible={false}
            forcedState={token.state === "one_variant" ? "one_variant" : "evaluated_with_multiple"}
            mode={"EDIT"}
            highlighted
            onSelectToken={handleSelectToken}
            selected={determineIfTokenIsSelected(token)}
          />
        ))}
      </SelectionWrapper>
    </>
  );
}

export default TokensTab;
