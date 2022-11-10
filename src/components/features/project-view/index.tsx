import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import FootnoteIcon from "@/assets/images/icons/footnote.svg";
import TokensIcon from "@/assets/images/icons/tokens.svg";
import VariantsIcon from "@/assets/images/icons/variants.svg";
import { usePanel } from "@/components/ui/panel";
import { Tab, TabsWrapper, useTabs } from "@/components/ui/tabs";
import Toggle, { useToggle } from "@/components/ui/toggle";
import { Mode } from "@/contexts/current-project-mode";
import { TokenContext } from "@/contexts/selectedToken";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled, { css } from "styled-components";

import BaseComments from "../comments";
import BaseInsignificantVariants from "../insignificant-variants";
import { useInvalidateGetInsignificantVariantsForProjectByIdQuery } from "../insignificant-variants/query";
import BaseSignificantVariants from "../significant-variants";
import { useInvalidateGetSignificantVariantsForProjectByIdQuery } from "../significant-variants/query";
import BaseVariantsSelection from "../variants-selection";
import { useGetTokensForProjectById, useInvalidateGetTokensForProjectByIdQuery } from "./query";
import TokensTab from "./tokens-tab";
import { useCopySelectedTextWithSignificantAndInsignificantVariants } from "./use-copy-selected-text-with-significant-and-insignificant-variants";
import VariantsTab from "./variants-tab";

type ProjectViewProps = {
  project: API.Project;
};

type TabVariant = "variants" | "tokens";

type StyledPanelProps = {
  isTall: boolean;
  $isOpen: boolean;
};

type ContentTopBarProps = {
  justifyContentFlexEnd: boolean;
};

type TabWrapperProps = {
  variant: TabVariant;
};

type LayoutProps = {
  gridTemplateColumns: string;
};

type GetGridTemplateColumnsProps = {
  selectedTab: TabVariant;
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  isVariantsSelectionPanelOpen: boolean;
  isCommentsPanelOpen: boolean;
  mode: Mode;
};

// TODO please reduce the cognitive complexity of this function before extending it further
const getGridTemplateColumns = ({
  selectedTab,
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  isCommentsPanelOpen,
  mode,
}: GetGridTemplateColumnsProps) => {
  if (selectedTab === "tokens") return "1fr";

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

const Layout = styled.div<LayoutProps>`
  display: grid;
  grid-template-columns: ${({ gridTemplateColumns }) => gridTemplateColumns};
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  border-right: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const ContentTopBar = styled.div<ContentTopBarProps>`
  display: flex;
  justify-content: ${({ justifyContentFlexEnd }) =>
    justifyContentFlexEnd ? "flex-end" : "space-between"};
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  padding: 0 8px 0 0;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const ToggleWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const TabWrapper = styled.div<TabWrapperProps>`
  position: relative;
  height: ${({ variant }) => (variant === "tokens" ? "calc(100% - 48px)" : "calc(100% - 78px)")};
  padding: 0px 0px 16px 0px;
`;

const PanelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 96px);
  border-right: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const panelStyles = css<StyledPanelProps>`
  flex-shrink: 0;
  overflow-y: scroll;
  max-height: ${({ isTall }) => (isTall ? "calc(100% - 80px)" : "calc(50% - 24px)")};
  height: ${({ $isOpen }) => !$isOpen && "unset"};
`;

const SignificantVariants = styled(BaseSignificantVariants)<StyledPanelProps>`
  ${panelStyles};
  ${({ $isOpen }) => !$isOpen && `border-bottom: none`};
`;

const Comments = styled(BaseComments)<StyledPanelProps>`
  ${panelStyles}
`;

const InsignificantVariants = styled(BaseInsignificantVariants)<StyledPanelProps>`
  ${panelStyles};
`;

const VariantsSelection = styled(BaseVariantsSelection)<StyledPanelProps>`
  ${panelStyles};
  ${({ $isOpen, theme }) => !$isOpen && `border-right: 1px solid ${theme.colors.borderSecondary}`};
`;

function ProjectView({ project }: ProjectViewProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();
  const { selectedTab, setSelectedTab } = useTabs<TabVariant>("variants");
  const { isOn: isApparatusIndexDisplayed, toggle: toggleApparatusIndexDisplay } = useToggle(true);
  const {
    isOpen: isSignificantVariantsPanelOpen,
    togglePanelVisibility: toggleSignificantVariantsPanelVisibility,
  } = usePanel();
  const {
    isOpen: isInsignificantVariantsPanelOpen,
    togglePanelVisibility: toggleInsignificantVariantsPanelVisibility,
  } = usePanel();
  const {
    isOpen: isVariantsSelectionPanelOpen,
    togglePanelVisibility: toggleVariantsSelectionPanelVisibility,
  } = usePanel();
  const { isOpen: isCommentsPanelOpen, togglePanelVisibility: toggleCommentsPanelVisibility } =
    usePanel();

  const projectId = project.id;

  const { data, isLoading, isError, isFetching, isRefetching, refetch } =
    useGetTokensForProjectById({
      projectId,
      mode,
    });

  const tokens = data?.records;

  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(
    tokens?.find(token => token.state !== "one_variant")?.id || null,
  );

  const { setTokenContextId } = useContext(TokenContext);

  useEffect(() => {
    selectedTokenId && setTokenContextId(selectedTokenId);
  }, [selectedTokenId, setTokenContextId]);

  useEffect(() => {
    if (mode === "READ") {
      setSelectedTab("variants");
    }
  }, [mode, setSelectedTab]);

  const { invalidateGetInsignificantVariantsForProjectById } =
    useInvalidateGetInsignificantVariantsForProjectByIdQuery();
  const { invalidateGetSignificantVariantsForProjectById } =
    useInvalidateGetSignificantVariantsForProjectByIdQuery();
  const { invalidateGetTokensForProjectById } = useInvalidateGetTokensForProjectByIdQuery();

  const {
    handleSetInsignificantVariantsCopyState,
    handleSetSelectionCopyState,
    handleSetSignificantVariantsCopyState,
  } = useCopySelectedTextWithSignificantAndInsignificantVariants();

  const handleSelectToken = useCallback((token: API.Token) => {
    if (token.state !== "one_variant") {
      setSelectedTokenId(token.id);
    }
  }, []);

  const handleInvalidateProjectViewQueries = async () => {
    await invalidateGetTokensForProjectById({
      mode: "EDIT",
      projectId,
    });
    await invalidateGetSignificantVariantsForProjectById({
      projectId,
    });
    await invalidateGetInsignificantVariantsForProjectById({
      projectId,
    });
  };

  return (
    <Layout
      gridTemplateColumns={getGridTemplateColumns({
        selectedTab,
        isInsignificantVariantsPanelOpen,
        isSignificantVariantsPanelOpen,
        isVariantsSelectionPanelOpen,
        isCommentsPanelOpen,
        mode,
      })}
    >
      <Content>
        <ContentTopBar justifyContentFlexEnd={mode === "READ"}>
          {mode === "EDIT" && (
            <TabsWrapper>
              <Tab
                icon={<VariantsIcon />}
                isSelected={selectedTab === "variants"}
                onSelect={() => setSelectedTab("variants")}
              >
                {t("project.variants_tab")}
              </Tab>
              <Tab
                icon={<TokensIcon />}
                isSelected={selectedTab === "tokens"}
                onSelect={() => setSelectedTab("tokens")}
              >
                {t("project.tokens_tab")}
              </Tab>
            </TabsWrapper>
          )}
          {selectedTab === "variants" && (
            <ToggleWrapper>
              <FootnoteIcon />
              <Toggle
                id="apparatus-index-toggle"
                value={String(isApparatusIndexDisplayed)}
                checked={isApparatusIndexDisplayed}
                onChange={toggleApparatusIndexDisplay}
              />
            </ToggleWrapper>
          )}
        </ContentTopBar>
        <TabWrapper variant={selectedTab}>
          {selectedTab === "tokens" && (
            <TokensTab
              projectId={projectId}
              tokens={tokens}
              isFetching={isFetching}
              isRefetching={isRefetching}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
            />
          )}
          {selectedTab === "variants" && (
            <VariantsTab
              mode={mode}
              tokens={tokens}
              selectedTokenId={selectedTokenId}
              isFetching={isFetching}
              isRefetching={isRefetching}
              isLoading={isLoading}
              isError={isError}
              isApparatusIndexDisplayed={isApparatusIndexDisplayed}
              onSelectToken={handleSelectToken}
              refetch={refetch}
              handleSetSelectionCopyState={handleSetSelectionCopyState}
            />
          )}
        </TabWrapper>
      </Content>
      {selectedTab === "variants" && (
        <>
          {mode === "EDIT" && (
            <PanelsWrapper>
              <VariantsSelection
                tokenId={selectedTokenId}
                projectId={projectId}
                isOpen={isVariantsSelectionPanelOpen}
                $isOpen={isVariantsSelectionPanelOpen}
                togglePanelVisibility={toggleVariantsSelectionPanelVisibility}
                isRotatedWhenClosed={!isCommentsPanelOpen}
                isTall={!isCommentsPanelOpen}
                invalidateProjectViewQueriesCallback={handleInvalidateProjectViewQueries}
              />
              <Comments
                tokenId={selectedTokenId}
                $isOpen={isCommentsPanelOpen}
                isOpen={isCommentsPanelOpen}
                togglePanelVisibility={toggleCommentsPanelVisibility}
                projectId={projectId}
                isRotatedWhenClosed={!isVariantsSelectionPanelOpen}
                isTall={!isVariantsSelectionPanelOpen}
              />
            </PanelsWrapper>
          )}
          <PanelsWrapper>
            <SignificantVariants
              isOpen={isSignificantVariantsPanelOpen}
              $isOpen={isSignificantVariantsPanelOpen}
              togglePanelVisibility={toggleSignificantVariantsPanelVisibility}
              projectId={projectId}
              isRotatedWhenClosed={!isInsignificantVariantsPanelOpen || mode === "READ"}
              isTall={!isInsignificantVariantsPanelOpen || mode === "READ"}
              apparatusIndexVisible={isApparatusIndexDisplayed}
              handleSetSignificantVariantsCopyState={handleSetSignificantVariantsCopyState}
            />
            {mode === "EDIT" && (
              <InsignificantVariants
                $isOpen={isInsignificantVariantsPanelOpen}
                isOpen={isInsignificantVariantsPanelOpen}
                togglePanelVisibility={toggleInsignificantVariantsPanelVisibility}
                projectId={projectId}
                isRotatedWhenClosed={!isSignificantVariantsPanelOpen}
                isTall={!isSignificantVariantsPanelOpen}
                apparatusIndexVisible={isApparatusIndexDisplayed}
                handleSetInsignificantVariantsCopyState={handleSetInsignificantVariantsCopyState}
              />
            )}
          </PanelsWrapper>
        </>
      )}
    </Layout>
  );
}

export default ProjectView;
