import { useCallback, useContext, useEffect, useState } from "react";

import FootnoteIcon from "@/assets/images/icons/footnote.svg";
import { usePanel } from "@/components/ui/panel";
import Toggle, { useToggle } from "@/components/ui/toggle";
import { Mode } from "@/contexts/current-project-mode";
import { TokenContext } from "@/contexts/selectedToken";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled, { css } from "styled-components";

import BaseInsignificantVariants from "../insignificant-variants";
import { useInvalidateGetInsignificantVariantsForProjectByIdQuery } from "../insignificant-variants/query";
import BaseSignificantVariants from "../significant-variants";
import { useInvalidateGetSignificantVariantsForProjectByIdQuery } from "../significant-variants/query";
import BaseVariantsSelection from "../variants-selection";
import { useGetTokensForProjectById, useInvalidateGetTokensForProjectByIdQuery } from "./query";
import VariantsTab from "./variants-tab";

type ProjectViewProps = {
  project: API.Project;
};

type StyledPanelProps = {
  isTall: boolean;
  $isOpen: boolean;
};

type LayoutProps = {
  gridTemplateColumns: string;
};

type GetGridTemplateColumnsProps = {
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  isVariantsSelectionPanelOpen: boolean;
  mode: Mode;
};

const getGridTemplateColumns = ({
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  mode,
}: GetGridTemplateColumnsProps) => {
  if (mode === "READ") {
    return isSignificantVariantsPanelOpen ? "1fr 270px" : "1fr 58px";
  }

  if (isSignificantVariantsPanelOpen) {
    return `1fr ${isVariantsSelectionPanelOpen ? "270px" : "58px"} 270px`;
  }

  if (isInsignificantVariantsPanelOpen) {
    return `1fr ${isVariantsSelectionPanelOpen ? "270px" : "58px"} 270px`;
  }

  if (isVariantsSelectionPanelOpen) {
    return "1fr 270px 58px";
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

const ContentTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  padding: 0 8px;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const VariantsTabWrapper = styled.div`
  position: relative;
  height: calc(100% - 78px);
  padding: 24px 24px 16px 24px;
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

const InsignificantVariants = styled(BaseInsignificantVariants)<StyledPanelProps>`
  ${panelStyles};
`;

const VariantsSelection = styled(BaseVariantsSelection)<StyledPanelProps>`
  ${panelStyles};
  ${({ $isOpen, theme }) => !$isOpen && `border-right: 1px solid ${theme.colors.borderSecondary}`};
`;

function ProjectView({ project }: ProjectViewProps) {
  const { mode } = useCurrentProjectMode();
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

  const handleSelectToken = useCallback((token: API.Token) => {
    if (token.state !== "one_variant") {
      setSelectedTokenId(token.id);
    }
  }, []);

  const { invalidateGetInsignificantVariantsForProjectById } =
    useInvalidateGetInsignificantVariantsForProjectByIdQuery();
  const { invalidateGetSignificantVariantsForProjectById } =
    useInvalidateGetSignificantVariantsForProjectByIdQuery();
  const { invalidateGetTokensForProjectById } = useInvalidateGetTokensForProjectByIdQuery();

  return (
    <Layout
      gridTemplateColumns={getGridTemplateColumns({
        isInsignificantVariantsPanelOpen,
        isSignificantVariantsPanelOpen,
        isVariantsSelectionPanelOpen,
        mode,
      })}
    >
      <Content>
        <ContentTopBar>
          <FootnoteIcon />
          <Toggle
            id="apparatus-index-toggle"
            value={String(isApparatusIndexDisplayed)}
            checked={isApparatusIndexDisplayed}
            onChange={toggleApparatusIndexDisplay}
          />
        </ContentTopBar>
        <VariantsTabWrapper>
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
          />
        </VariantsTabWrapper>
      </Content>
      {mode === "EDIT" && (
        <PanelsWrapper>
          <VariantsSelection
            tokenId={selectedTokenId}
            projectId={projectId}
            isOpen={isVariantsSelectionPanelOpen}
            $isOpen={isVariantsSelectionPanelOpen}
            togglePanelVisibility={toggleVariantsSelectionPanelVisibility}
            isRotatedWhenClosed
            isTall={true}
            invalidateProjectViewQueriesCallback={async () => {
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
            }}
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
          />
        )}
      </PanelsWrapper>
    </Layout>
  );
}

export default ProjectView;
