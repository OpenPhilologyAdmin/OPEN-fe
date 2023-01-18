import { useState } from "react";

function useTokensTabSelectedTokensForCreation() {
  const [selectedTokens, setSelectedTokens] = useState<API.Token[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);

  const determineIfTokenIsSelected = (token: API.Token) =>
    selectedTokens.map(({ id }) => id).includes(token.id);

  const handleSelectToken = (selectedToken: API.Token) => {
    if (!selectionEnabled) return;

    const sortedSelectedTokenIndices = selectedTokens
      .map(({ index }) => index)
      .sort((a, b) => a - b);

    if (determineIfTokenIsSelected(selectedToken)) {
      // checks whether the selected token is not the first or not the last token in the list
      if (
        sortedSelectedTokenIndices[0] !== selectedToken.index &&
        sortedSelectedTokenIndices[sortedSelectedTokenIndices.length - 1] !== selectedToken.index
      ) {
        return setSelectedTokens([selectedToken]);
      }

      return setSelectedTokens(selectedTokens.filter(({ index }) => index !== selectedToken.index));
    } else {
      const left = sortedSelectedTokenIndices[0];
      const right = sortedSelectedTokenIndices[sortedSelectedTokenIndices.length - 1];

      if (left - 1 === selectedToken.index || right + 1 === selectedToken.index) {
        return setSelectedTokens(
          [...selectedTokens, selectedToken].sort((a, b) => a.index - b.index),
        );
      }

      return setSelectedTokens([selectedToken]);
    }
  };

  const toggleSelectionAvailability = () => {
    setSelectionEnabled(prev => !prev);
    setSelectedTokens([]);
  };

  return {
    selectionEnabled,
    selectedTokens,
    handleSelectToken,
    determineIfTokenIsSelected,
    toggleSelectionAvailability,
  };
}

export { useTokensTabSelectedTokensForCreation };
