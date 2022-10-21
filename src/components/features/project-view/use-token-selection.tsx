import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography/new_index";
import { getRangeById } from "@/utils/get-range-by-id";
import { isEmptyString } from "@/utils/is-empty-string";

/**
 * The boundary tokens are the tokens that are at the beginning and the end of the selected text.
 * They are are used for backend to determine the split points of the selected text.
 * For only 1 selected token, boundary tokens are the same token but with different offset.
 */
type BoundaryToken = {
  id: number;
  offset?: number;
};

type Params = {
  tokens?: API.Token[];
  withValidation?: boolean;
};

export type SelectionState = {
  selectedText: string;
  selectedTokens: API.Token[];
  boundaryTokens: BoundaryToken[];
};

export const initialSelectionState: SelectionState = {
  selectedText: "",
  selectedTokens: [],
  boundaryTokens: [],
};

/** Passing token id to token element is a mandatory step for selection to work, it relies on tokenId passed to the HTML element */
export const stringifyTokenIdForSelection = (tokenId: number) => String(tokenId);

const getSelectedTokensRangeByBoundaryTokenIds = (
  tokens: API.Token[],
  startTokenId: number,
  endTokenId: number,
) => {
  return getRangeById<API.Token>(tokens, startTokenId, endTokenId);
};

function useTokenSelection({ tokens, withValidation }: Params) {
  const { t } = useTranslation();
  const [selectionState, setSelectionState] = useState(initialSelectionState);
  const selectionRef = useRef<Selection | null>(null);

  const clearSelection = () => selectionRef.current?.empty();

  const getSelectionState = (): SelectionState => {
    selectionRef.current = window.getSelection();

    const selectedText = selectionRef.current?.toString();

    if (isEmptyString(selectedText)) {
      return initialSelectionState;
    }

    const startToken = {
      id: Number(selectionRef.current?.anchorNode?.parentElement?.id),
      offset: selectionRef.current?.anchorOffset,
    };

    const endToken = {
      id: Number(selectionRef.current?.focusNode?.parentElement?.id),
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

    if (withValidation) {
      nextState.selectedTokens.forEach(token => {
        if (token.state !== "one_variant") {
          matches++;
        }
      });

      // Only 1 token with multiple variants is allowed
      if (matches >= 2) {
        toast.error(<Typography>{t("project.too_many_tokens_error")}</Typography>, {
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
        toast.error(<Typography>{t("project.same_token_error")}</Typography>, {
          // toastId is used to prevent multiple toasts from showing up
          toastId: "same_token_error",
        });

        clearSelection();

        return initialSelectionState;
      }
    }

    return isEmptyString(prevState.selectedText) && isEmptyString(nextState.selectedText)
      ? prevState
      : nextState;
  };

  const handleUpdateSelection = () => {
    setSelectionState(updateSelectionState);
  };

  const handleSave = (callback?: () => void) => {
    setSelectionState(initialSelectionState);
    clearSelection();

    if (callback) {
      callback();
    }
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

export { useTokenSelection };
