import { useState } from "react";

function useTokensTabSelectedTokenForSplit() {
  const [selectedTokenIdForSplitOnTokensTab, setSelectedTokenIdForSplitOnTokensTab] = useState<
    number | null
  >(null);

  const handleSelectTokenForSplit = (selectedToken: API.Token) => {
    if (selectedTokenIdForSplitOnTokensTab === selectedToken.id) {
      return setSelectedTokenIdForSplitOnTokensTab(null);
    }

    setSelectedTokenIdForSplitOnTokensTab(selectedToken.id);
  };

  return {
    selectedTokenIdForSplitOnTokensTab,
    setSelectedTokenIdForSplitOnTokensTab,
    handleSelectTokenForSplit,
  };
}

export { useTokensTabSelectedTokenForSplit };
