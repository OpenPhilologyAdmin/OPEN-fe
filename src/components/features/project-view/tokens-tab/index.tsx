import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import BaseButton from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import { toast } from "@/components/ui/toast";
import Token from "@/components/ui/token";
import NewTypography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useEditTokensByProjectId } from "./query";

type WrapperProps = {
  $withPadding: boolean;
};

export type TokensTabProps = {
  projectId: number;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  tokens?: API.Token[];
  refetch: () => Promise<any>;
};

type TokensTabErrorPros = {
  refetch: () => Promise<any>;
};

/**
 * The boundary tokens are the tokens that are at the beginning and the end of the selected text.
 * They are are used for backend to determine the split points of the selected text.
 * For only 1 selected token, boundary tokens are the same token but with different offset.
 */
type BoundaryToken = {
  id: number;
  offset?: number;
};

type SelectionState = {
  selectedText: string;
  selectedTokens: API.Token[];
  boundaryTokens: BoundaryToken[];
};

type UseTokensTabSelectionProps = {
  projectId: number;
  refetch: () => Promise<void>;
  tokens?: API.Token[];
};

const TOKEN_ID_PREFIX = "edit-token-";

const ERROR_FIELDS = ["project", "selected_text", "selected_token_ids", "tokens_with_offsets"];

const initialSelectionState: SelectionState = {
  selectedText: "",
  selectedTokens: [],
  boundaryTokens: [],
};

const isEmptyString = (str?: string) => str === "";

const getSelectedTokensRangeByBoundaryTokenIds = (
  tokens: API.Token[],
  startTokenId: number,
  endTokenId: number,
) => {
  const tokenIds = tokens.map(token => token.id);
  const startTokenIndex = tokenIds.indexOf(startTokenId);
  const endTokenIndex = tokenIds.indexOf(endTokenId);
  const selectedTokens =
    startTokenIndex < endTokenIndex
      ? tokens.slice(startTokenIndex, endTokenIndex + 1)
      : tokens.slice(endTokenIndex, startTokenIndex + 1);

  return selectedTokens;
};

const Wrapper = styled.div<WrapperProps>`
  overflow-x: hidden;
  z-index: 0;
  height: 100%;
  ${({ $withPadding }) => $withPadding && "padding-bottom: 72px"};
`;

const Button = styled(BaseButton)`
  user-select: none;
`;

const FixedPanel = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  padding: 16px;
  gap: 16px;
  justify-content: flex-end;
  height: 72px;
  left: 0;
  bottom: 0;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.08);
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

function useTokensTabSelection({ projectId, refetch, tokens }: UseTokensTabSelectionProps) {
  const { t } = useTranslation();
  const [selectionState, setSelectionState] = useState(initialSelectionState);
  const selectionRef = useRef<Selection | null>(null);
  const { mutate: editTokensByProjectId } = useEditTokensByProjectId({
    onSuccess: async ({ data: { message } }) => {
      toast.success(<NewTypography>{message}</NewTypography>);
      await refetch();
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<NewTypography>{apiError.error}</NewTypography>);
        }

        ERROR_FIELDS.forEach(field => {
          if (apiError[field]) {
            apiError[field].forEach(error => {
              toast.error(<NewTypography>{error}</NewTypography>);
            });
          }
        });
      }
    },
  });

  const clearSelection = () => selectionRef.current?.empty();

  const getSelectionState = (): SelectionState => {
    selectionRef.current = window.getSelection();

    const selectedText = selectionRef.current?.toString();

    if (isEmptyString(selectedText)) {
      return initialSelectionState;
    }

    const startToken = {
      id: Number(selectionRef.current?.anchorNode?.parentElement?.id.replace(TOKEN_ID_PREFIX, "")),
      offset: selectionRef.current?.anchorOffset,
    };

    const endToken = {
      id: Number(selectionRef.current?.focusNode?.parentElement?.id.replace(TOKEN_ID_PREFIX, "")),
      offset: selectionRef.current?.focusOffset,
    };

    const selectedTokens = getSelectedTokensRangeByBoundaryTokenIds(
      tokens || [],
      startToken.id,
      endToken.id,
    );

    return {
      selectedText: selectedText || "",
      selectedTokens: selectedTokens,
      boundaryTokens: [startToken, endToken],
    };
  };

  const updateSelectionState = (prevState: SelectionState) => {
    const nextState = getSelectionState();

    let matches = 0;

    nextState.selectedTokens.forEach(token => {
      if (token.state !== "one_variant") {
        matches++;
      }
    });

    // Only 1 token with multiple variants is allowed
    if (matches >= 2) {
      toast.error(<NewTypography>{t("project.too_many_tokens_error")}</NewTypography>, {
        // toastId is used to prevent multiple toasts from showing up
        toastId: "too_many_tokens_error",
      });

      clearSelection();

      return initialSelectionState;
    }

    // Cannot split a token with multiple variants in the middle
    if (
      !isEmptyString(nextState.selectedText) &&
      nextState.boundaryTokens[0]?.id === nextState.boundaryTokens[1]?.id &&
      nextState.selectedTokens.every(token => token.state !== "one_variant")
    ) {
      toast.error(<NewTypography>{t("project.same_token_error")}</NewTypography>, {
        // toastId is used to prevent multiple toasts from showing up
        toastId: "same_token_error",
      });

      clearSelection();

      return initialSelectionState;
    }

    return isEmptyString(prevState.selectedText) && isEmptyString(nextState.selectedText)
      ? prevState
      : nextState;
  };

  const handleUpdateSelection = () => {
    setSelectionState(updateSelectionState);
  };

  const handleSave = () => {
    editTokensByProjectId({
      projectId,
      data: {
        token: {
          selected_text: selectionState.selectedText,
          selected_token_ids: selectionState.selectedTokens.map(token => token.id),
          tokens_with_offsets: selectionState.boundaryTokens.map(token => ({
            token_id: token.id,
            offset: token.offset,
          })),
        },
      },
    });
    setSelectionState(initialSelectionState);
    clearSelection();
  };

  const handleCancel = () => {
    setSelectionState(initialSelectionState);
    clearSelection();
  };

  return {
    selectionState,
    handleSave,
    handleCancel,
    handleUpdateSelection,
  };
}

function TokensTab({
  projectId,
  tokens,
  isError,
  isLoading,
  isRefetching,
  isFetching,
  refetch,
}: TokensTabProps) {
  const { t } = useTranslation();
  const { selectionState, handleCancel, handleSave, handleUpdateSelection } = useTokensTabSelection(
    {
      projectId,
      refetch,
      tokens,
    },
  );

  if (isLoading && !tokens) return <TokensTabLoader />;

  if (isError && !isRefetching) return <TokensTabError refetch={refetch} />;

  if (!tokens) return null;

  const isSelecting = !isEmptyString(selectionState.selectedText);

  return (
    <>
      <Wrapper onMouseUp={handleUpdateSelection} $withPadding={isSelecting}>
        {(isFetching || isRefetching) && <TokensTabLoader />}
        {isError && !isRefetching && <TokensTabError refetch={refetch} />}
        {tokens.map(token => (
          <Token
            data-testid="token"
            key={token.id}
            token={token}
            // Used to find elements in the DOM by id to read the selection anchor node and focus node
            id={`${TOKEN_ID_PREFIX}${String(token.id)}`}
            apparatusIndexVisible={false}
            forcedState={token.state === "one_variant" ? "one_variant" : "evaluated_with_multiple"}
            mode={"EDIT"}
            highlighted
          />
        ))}
      </Wrapper>

      {isSelecting && (
        <FixedPanel>
          <Button onClick={handleSave}>{t("project.create_token")}</Button>
          <Button variant="secondary" onClick={handleCancel}>
            {t("project.cancel")}
          </Button>
        </FixedPanel>
      )}
    </>
  );
}

export default TokensTab;
