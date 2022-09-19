import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import Token from "@/components/ui/token";
import { Mode } from "@/contexts/current-project-mode";
import styled from "styled-components";

type VariantsTabProps = {
  mode: Mode;
  selectedTokenId: number | null;
  isLoading: boolean;
  isApparatusIndexDisplayed: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  tokens?: API.Token[];
  refetch: () => Promise<any>;
  onSelectToken: (token: API.Token) => void;
};

type VariantsTabErrorPros = {
  refetch: () => Promise<any>;
};

const Wrapper = styled.div`
  overflow-x: hidden;
  z-index: 0;
  height: 100%;
`;

function VariantsTabLoader() {
  const { t } = useTranslation();

  return <MaskLoader text={t("project.loader_text")} withBackgroundMask />;
}

function VariantsTabError({ refetch }: VariantsTabErrorPros) {
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

function VariantsTab({
  selectedTokenId,
  tokens,
  mode,
  isError,
  isLoading,
  isRefetching,
  isFetching,
  refetch,
  onSelectToken,
  isApparatusIndexDisplayed,
}: VariantsTabProps) {
  if (isLoading && !tokens) return <VariantsTabLoader />;

  if (isError && !isRefetching) return <VariantsTabError refetch={refetch} />;

  return (
    <Wrapper>
      {(isFetching || isRefetching) && <VariantsTabLoader />}
      {isError && !isRefetching && <VariantsTabError refetch={refetch} />}
      {tokens?.map(token => (
        <Token
          data-testid="token"
          key={token.id}
          token={token}
          mode={mode}
          onSelectToken={onSelectToken}
          highlighted={token.id === selectedTokenId}
          apparatusIndexVisible={isApparatusIndexDisplayed}
        />
      ))}
    </Wrapper>
  );
}

export { VariantsTabLoader, VariantsTabError };
export default VariantsTab;
