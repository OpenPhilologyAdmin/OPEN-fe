import { Mode } from "@/contexts/current-project-mode";

export type TabVariant = "variants" | "tokens";

type VariantsTabLayoutProps = {
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  isVariantsSelectionPanelOpen: boolean;
  isCommentsPanelOpen: boolean;
  mode: Mode;
};

type TokensTabLayoutProps = {
  isTokensPanelOpen: boolean;
};

type GetGridTemplateColumnsProps = VariantsTabLayoutProps &
  TokensTabLayoutProps & {
    selectedTab: TabVariant;
    isSignificantVariantsPanelOpen: boolean;
    isInsignificantVariantsPanelOpen: boolean;
    isVariantsSelectionPanelOpen: boolean;
    isCommentsPanelOpen: boolean;
  };

const getLayoutForVariantsTab = ({
  isCommentsPanelOpen,
  isInsignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  isSignificantVariantsPanelOpen,
  mode,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
VariantsTabLayoutProps) => {
  if (mode === "READ") {
    return isSignificantVariantsPanelOpen ? "1fr 270px" : "1fr 58px";
  }

  if (isSignificantVariantsPanelOpen) {
    return `1fr ${isVariantsSelectionPanelOpen || isCommentsPanelOpen ? "270px" : "58px"} 270px`;
  }

  if (isInsignificantVariantsPanelOpen) {
    return `1fr ${isVariantsSelectionPanelOpen || isCommentsPanelOpen ? "270px" : "58px"} 270px`;
  }

  if (isVariantsSelectionPanelOpen) {
    return `1fr ${
      (!isSignificantVariantsPanelOpen &&
        !isInsignificantVariantsPanelOpen &&
        !isCommentsPanelOpen) ||
      isSignificantVariantsPanelOpen ||
      isInsignificantVariantsPanelOpen ||
      isCommentsPanelOpen
        ? "270px"
        : "58px"
    }
    ${!isSignificantVariantsPanelOpen && !isInsignificantVariantsPanelOpen ? "58px" : "270px"}`;
  }

  if (isCommentsPanelOpen) {
    return `1fr ${
      isSignificantVariantsPanelOpen ||
      isInsignificantVariantsPanelOpen ||
      isVariantsSelectionPanelOpen ||
      isCommentsPanelOpen
        ? "270px"
        : "58px"
    } ${!isSignificantVariantsPanelOpen && !isInsignificantVariantsPanelOpen ? "58px" : "270px"}`;
  }

  return "1fr 58px 58px";
};

const getLayoutForTokensTab = ({ isTokensPanelOpen }: TokensTabLayoutProps) => {
  return isTokensPanelOpen ? "1fr 270px" : "1fr 58px";
};

const getGridTemplateColumns = ({
  selectedTab,
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  isCommentsPanelOpen,
  isTokensPanelOpen,
  mode,
}: GetGridTemplateColumnsProps) => {
  if (selectedTab === "tokens") {
    return getLayoutForTokensTab({ isTokensPanelOpen });
  }

  if (selectedTab === "variants") {
    return getLayoutForVariantsTab({
      isInsignificantVariantsPanelOpen,
      isSignificantVariantsPanelOpen,
      isVariantsSelectionPanelOpen,
      isCommentsPanelOpen,
      mode,
    });
  }

  return "1fr";
};

export { getGridTemplateColumns };
