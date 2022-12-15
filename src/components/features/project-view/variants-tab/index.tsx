import { ComponentPropsWithoutRef, useEffect } from "react";
import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import Token from "@/components/ui/token";
import { Mode } from "@/contexts/current-project-mode";
import styled from "styled-components";

import {
  SelectionState,
  stringifyTokenIdForSelection,
  useTokenSelection,
} from "../use-token-selection";

type VariantsTabProps = ComponentPropsWithoutRef<"div"> & {
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
  handleSetSelectionCopyState?: (selectionState: SelectionState) => void;
};

type VariantsTabErrorPros = {
  refetch: () => Promise<any>;
};

const Wrapper = styled.div`
  overflow-x: hidden;
  padding: 24px 24px 0px 24px;
  z-index: 0;
  height: 100%;
`;

export const VARIANTS_TAB_WRAPPER_ID = "variants-tab-wrapper";
export const VARIANTS_TOKEN_ID = "variants-token-id";

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
  handleSetSelectionCopyState,
}: VariantsTabProps) {
  const { selectionState, handleUpdateSelection } = useTokenSelection({
    tokens,
    withValidation: false,
  });

  useEffect(() => {
    if (handleSetSelectionCopyState && selectionState) {
      handleSetSelectionCopyState(selectionState);
    }
  }, [selectionState, handleSetSelectionCopyState]);

  if (isLoading && !tokens) return <VariantsTabLoader />;

  if (isError && !isRefetching) return <VariantsTabError refetch={refetch} />;

  return (
    <Wrapper
      // used for copy feature to work within the wrapper
      id={VARIANTS_TAB_WRAPPER_ID}
      onMouseUp={handleUpdateSelection}
    >
      {(isFetching || isRefetching) && <VariantsTabLoader />}
      {isError && !isRefetching && <VariantsTabError refetch={refetch} />}
      {tokens?.map(token => (
        <Token
          data-testid="token"
          // Sometimes the selection event's parent element is a token and node the tab wrapper, therefore this custom attribute was added to the assertion
          data-variant-token-id={`${VARIANTS_TOKEN_ID}-${token.id}}`}
          // Used to find elements in the DOM by id to read the selection anchor node and focus node
          id={stringifyTokenIdForSelection(token.id)}
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

export default VariantsTab;
