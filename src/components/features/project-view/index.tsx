import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import "allotment/dist/style.css";

import FootnoteIcon from "@/assets/images/icons/footnote.svg";
import TokensIcon from "@/assets/images/icons/tokens.svg";
import VariantsIcon from "@/assets/images/icons/variants.svg";
import useAllotment from "@/components/ui/allotment";
import { usePanel } from "@/components/ui/panel";
import { Tab, TabsWrapper, useTabs } from "@/components/ui/tabs";
import Toggle, { useToggle } from "@/components/ui/toggle";
import { useVariantsTabSelectedTokenContext } from "@/contexts/selected-token";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled, { css } from "styled-components";

import BaseComments from "../comments";
import BaseInsignificantVariants from "../insignificant-variants";
import { useInvalidateGetInsignificantVariantsForProjectByIdQuery } from "../insignificant-variants/query";
import BaseSignificantVariants from "../significant-variants";
import { useInvalidateGetSignificantVariantsForProjectByIdQuery } from "../significant-variants/query";
import BaseTokensPanel from "../tokens-panel";
import BaseVariantsSelection from "../variants-selection";
import { getGridTemplateColumns, TabVariant } from "./layout-helpers";
import { useGetTokensForProjectById, useInvalidateGetTokensForProjectByIdQuery } from "./query";
import TokensTab from "./tokens-tab";
import { useTokensTabSelectedTokenForSplit } from "./tokens-tab/use-tokens-tab-selected-token-for-split";
import { useTokensTabSelectedTokensForCreation } from "./tokens-tab/use-tokens-tab-selected-tokens-for-creation";
import VariantsTab from "./variants-tab";
import { useCopySelectedTextWithSignificantAndInsignificantVariants } from "./variants-tab/use-copy-selected-text-with-significant-and-insignificant-variants";

type ProjectViewProps = {
  project: API.Project;
};

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

const INITIAL_PANEL_SIZE = 10000;

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
  height: ${({ variant }) => (variant === "tokens" ? "100%" : "calc(100% - 48px)")};
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

const TokensPanel = styled(BaseTokensPanel)<StyledPanelProps>`
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
  const { isOpen: isTokensPanelOpen, togglePanelVisibility: toggleTokensPanelVisibility } =
    usePanel();
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
  const [preferredWidth, setPreferredWidth] = useState(INITIAL_PANEL_SIZE);
  const [panelsWidth, setPanelsWidth] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const varianPanelWrapperRef = useRef<HTMLDivElement>(null);
  const commentsPanelWrapperRef = useRef<HTMLDivElement>(null);

  const { allotmentRef, Allotment } = useAllotment();

  const projectId = project.id;

  const { data, isLoading, isError, isFetching, isRefetching, refetch } =
    useGetTokensForProjectById({
      projectId,
      mode,
    });

  const tokens = data?.records;

  const [selectedTokenIdForVariantsTab, setSelectedTokenIdForVariantsTab] = useState<number | null>(
    tokens?.find(token => token.state !== "one_variant")?.id || null,
  );

  const {
    selectedTokenIdForSplitOnTokensTab,
    handleSelectTokenForSplit,
    setSelectedTokenIdForSplitOnTokensTab,
  } = useTokensTabSelectedTokenForSplit();

  const { setTokenContextId } = useVariantsTabSelectedTokenContext();

  useEffect(() => {
    selectedTokenIdForVariantsTab && setTokenContextId(selectedTokenIdForVariantsTab);
  }, [selectedTokenIdForVariantsTab, setTokenContextId]);

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

  const {
    selectionEnabled: selectionForCreationEnabled,
    toggleSelectionAvailability: toggleSelectionForCreationAvailability,
    selectedTokens: selectedTokensForCreation,
    handleSelectToken: handleSelectTokensTabTokenForCreation,
    determineIfTokenIsSelected: determineIfTokensTabTokenIsSelectedForCreation,
  } = useTokensTabSelectedTokensForCreation();

  const handleSelectVariantsTabToken = useCallback((token: API.Token) => {
    if (token.state !== "one_variant") {
      setSelectedTokenIdForVariantsTab(token.id);
    }
  }, []);

  const handleTokensPanelReset = () => {
    setSelectedTokenIdForVariantsTab(null);
    setTokenContextId(undefined);
    setSelectedTokenIdForSplitOnTokensTab(null);
  };

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
    // TODO consider changing layout to a separate file component
    <Layout
      gridTemplateColumns={getGridTemplateColumns({
        selectedTab,
        isInsignificantVariantsPanelOpen,
        isSignificantVariantsPanelOpen,
        isVariantsSelectionPanelOpen,
        isCommentsPanelOpen,
        isTokensPanelOpen,
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
                onSelect={() => {
                  if (selectedTab === "variants") return;

                  setSelectedTab("variants");

                  const variantsContentWidth = contentRef.current?.clientWidth || 0;

                  setPreferredWidth(variantsContentWidth);

                  if (allotmentRef.current) {
                    allotmentRef.current.resize([
                      variantsContentWidth,
                      window.innerWidth - variantsContentWidth - panelsWidth,
                    ]);
                  }
                }}
              >
                {t("project.variants_tab")}
              </Tab>
              <Tab
                icon={<TokensIcon />}
                isSelected={selectedTab === "tokens"}
                onSelect={() => {
                  if (selectedTab === "tokens") return;

                  const panelsWidth =
                    (varianPanelWrapperRef.current?.clientWidth || 0) +
                    (commentsPanelWrapperRef.current?.clientWidth || 0);

                  setPanelsWidth(panelsWidth);
                  setSelectedTab("tokens");

                  if (allotmentRef.current && contentRef.current) {
                    const tokensContentWidth = contentRef.current?.clientWidth || 0;

                    setPreferredWidth(tokensContentWidth);

                    allotmentRef.current.resize([
                      tokensContentWidth,
                      window.innerWidth - tokensContentWidth,
                    ]);
                  }
                }}
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
        <Allotment ref={allotmentRef} key={selectedTab}>
          <Allotment.Pane preferredSize={preferredWidth}>
            <TabWrapper variant={selectedTab} ref={contentRef}>
              {selectedTab === "tokens" && (
                <TokensTab
                  projectId={projectId}
                  tokenIdForSplit={selectedTokenIdForSplitOnTokensTab}
                  tokens={tokens}
                  isFetching={isFetching}
                  isRefetching={isRefetching}
                  isLoading={isLoading}
                  isError={isError}
                  refetch={refetch}
                  handleSelectToken={
                    selectionForCreationEnabled
                      ? handleSelectTokensTabTokenForCreation
                      : handleSelectTokenForSplit
                  }
                  selectionForCreationEnabled={selectionForCreationEnabled}
                  determineIfTokensTabTokenIsSelectedForCreation={
                    determineIfTokensTabTokenIsSelectedForCreation
                  }
                />
              )}
              {selectedTab === "variants" && (
                <VariantsTab
                  mode={mode}
                  tokens={tokens}
                  selectedTokenId={selectedTokenIdForVariantsTab}
                  isFetching={isFetching}
                  isRefetching={isRefetching}
                  isLoading={isLoading}
                  isError={isError}
                  isApparatusIndexDisplayed={isApparatusIndexDisplayed}
                  onSelectToken={handleSelectVariantsTabToken}
                  refetch={refetch}
                  handleSetSelectionCopyState={handleSetSelectionCopyState}
                />
              )}
            </TabWrapper>
          </Allotment.Pane>

          <Allotment.Pane>{/* empty placeholder to allow resizing */}</Allotment.Pane>
        </Allotment>
      </Content>
      {selectedTab === "tokens" && (
        <PanelsWrapper>
          <TokensPanel
            isCreating={selectionForCreationEnabled}
            isError={isError}
            isFetching={isFetching}
            isRefetching={isRefetching}
            isLoading={isLoading}
            isTall
            isOpen={isTokensPanelOpen}
            $isOpen={isTokensPanelOpen}
            isRotatedWhenClosed
            selectedTokenIdForSplit={selectedTokenIdForSplitOnTokensTab}
            selectedTokensForCreation={selectedTokensForCreation}
            projectId={projectId}
            refetch={refetch}
            togglePanelVisibility={toggleTokensPanelVisibility}
            invalidateProjectViewQueriesCallback={handleInvalidateProjectViewQueries}
            toggleSelectionAvailability={toggleSelectionForCreationAvailability}
            handleReset={handleTokensPanelReset}
          />
        </PanelsWrapper>
      )}

      {selectedTab === "variants" && (
        <>
          {mode === "EDIT" && (
            <PanelsWrapper ref={commentsPanelWrapperRef}>
              <VariantsSelection
                tokenId={selectedTokenIdForVariantsTab}
                projectId={projectId}
                isOpen={isVariantsSelectionPanelOpen}
                $isOpen={isVariantsSelectionPanelOpen}
                togglePanelVisibility={toggleVariantsSelectionPanelVisibility}
                isRotatedWhenClosed={!isCommentsPanelOpen}
                isTall={!isCommentsPanelOpen}
                invalidateProjectViewQueriesCallback={handleInvalidateProjectViewQueries}
              />
              <Comments
                tokenId={selectedTokenIdForVariantsTab}
                $isOpen={isCommentsPanelOpen}
                isOpen={isCommentsPanelOpen}
                togglePanelVisibility={toggleCommentsPanelVisibility}
                projectId={projectId}
                isRotatedWhenClosed={!isVariantsSelectionPanelOpen}
                isTall={!isVariantsSelectionPanelOpen}
              />
            </PanelsWrapper>
          )}
          <PanelsWrapper ref={varianPanelWrapperRef}>
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
