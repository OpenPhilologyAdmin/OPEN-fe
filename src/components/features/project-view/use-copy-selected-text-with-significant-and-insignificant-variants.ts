import { useCallback, useEffect, useState } from "react";

import { initialSelectionState, SelectionState } from "./use-token-selection";
import { VARIANTS_TAB_WRAPPER_ID, VARIANTS_TOKEN_ID } from "./variants-tab";

type CopyState = {
  selection: SelectionState;
  significantVariants: API.SignificantVariant[] | null;
  insignificantVariants: API.InsignificantVariant[] | null;
};

const getTextFromVariant = (variant: API.SignificantVariant | API.InsignificantVariant) => {
  return `(${variant.index})` + variant.value.selected_reading + variant.value.details;
};

const getTextFromVariants = (
  variants: (API.SignificantVariant | undefined)[] | (API.InsignificantVariant | undefined)[],
) => {
  return variants && variants.length > 0
    ? variants.map(variant => {
        if (variant) {
          return getTextFromVariant(variant);
        }
      })
    : "";
};

const getVariantsFromSelectedTokens = (
  selectedTokens: API.Token[],
  variants: API.SignificantVariant[] | API.InsignificantVariant[] | null,
) => {
  return selectedTokens
    .map(token => {
      return variants?.find(variant => variant.token_id === token.id);
    })
    .filter(Boolean);
};

function useCopySelectedTextWithSignificantAndInsignificantVariants() {
  const [copyState, setCopyState] = useState<CopyState>({
    selection: initialSelectionState,
    significantVariants: null,
    insignificantVariants: null,
  });

  const handleSetSignificantVariantsCopyState = useCallback(
    (significantVariants: API.SignificantVariant[]) => {
      setCopyState(state => ({
        ...state,
        significantVariants,
      }));
    },
    [setCopyState],
  );

  const handleSetInsignificantVariantsCopyState = useCallback(
    (insignificantVariants: API.InsignificantVariant[]) => {
      setCopyState(state => ({
        ...state,
        insignificantVariants,
      }));
    },
    [setCopyState],
  );

  const handleSetSelectionCopyState = useCallback(
    (selection: SelectionState) => {
      setCopyState(state => ({
        ...state,
        selection,
      }));
    },
    [setCopyState],
  );

  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      const parentNode = (event.target as Element).parentNode as Element;

      if (
        event.clipboardData &&
        copyState &&
        (parentNode.id === VARIANTS_TAB_WRAPPER_ID ||
          parentNode.getAttribute("data-variant-token-id")?.includes(VARIANTS_TOKEN_ID))
      ) {
        event.preventDefault();

        const significantVariantsForSelectedText = getVariantsFromSelectedTokens(
          copyState.selection.selectedTokens,
          copyState.significantVariants,
        );

        const insignificantVariantsForSelectedText = getVariantsFromSelectedTokens(
          copyState.selection.selectedTokens,
          copyState.insignificantVariants,
        );

        event.clipboardData.setData(
          "text/html",
          JSON.stringify(
            copyState.selection.selectedText +
              getTextFromVariants(significantVariantsForSelectedText) +
              getTextFromVariants(insignificantVariantsForSelectedText),
          ).trim(),
        );
      }
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [copyState]);

  return {
    handleSetSignificantVariantsCopyState,
    handleSetInsignificantVariantsCopyState,
    handleSetSelectionCopyState,
  };
}

export { useCopySelectedTextWithSignificantAndInsignificantVariants };
