import { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import { usePanel } from "@/components/ui/panel";
import BaseToken from "@/components/ui/token";
import Typography from "@/components/ui/typography";
import { Mode } from "@/contexts/current-project-mode";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled, { css } from "styled-components";

import BaseInsignificantVariants from "../insignificant-variants";
import { useInvalidateGetInsignificantVariantsForProjectByIdQuery } from "../insignificant-variants/query";
import BaseSignificantVariants from "../significant-variants";
import { useInvalidateGetSignificantVariantsForProjectByIdQuery } from "../significant-variants/query";
import BaseVariantsSelection from "../variants-selection";
import { useGetTokensForProjectById, useInvalidateGetTokensForProjectByIdQuery } from "./query";

type ProjectViewProps = {
  project: API.Project;
};

type StyledPanelProps = {
  isTall: boolean;
  $isOpen: boolean;
};

type ProjectViewChildrenCommonProps = {
  refetch: () => void;
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  isVariantsSelectionPanelOpen: boolean;
  toggleInsignificantVariantsPanelVisibility: () => void;
  toggleSignificantVariantsPanelVisibility: () => void;
  toggleVariantsSelectionPanelVisibility: () => void;
};

type ViewProps = ProjectViewChildrenCommonProps & {
  isLoading: boolean;
  isError: boolean;
  tokens: API.Token[];
  projectId: number;
};

type MaskProps = ProjectViewChildrenCommonProps & {
  projectId: number;
  variant: "loader" | "error";
  buttonText?: string;
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const MaskWrapper = styled.div`
  position: relative;
  height: calc(100% - 78px);
  padding: 24px 24px 16px 24px;
  overflow-y: scroll;
`;

const ContentTokensWrapper = styled.div`
  height: 100%;
  overflow-x: hidden;
  z-index: 0;
`;

const Token = styled(BaseToken)`
  margin-right: 4px;
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

function Mask({
  variant,
  buttonText,
  refetch,
  projectId,
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  toggleInsignificantVariantsPanelVisibility,
  toggleSignificantVariantsPanelVisibility,
  toggleVariantsSelectionPanelVisibility,
}: MaskProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();

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
        <ContentTopBar />
        <ContentTokensWrapper>
          {variant === "loader" && <MaskLoader text={t("project.loader_text")} />}
          {variant === "error" && buttonText && refetch && (
            <MaskError
              text={t("project.generic_error")}
              buttonText={buttonText}
              refetch={refetch}
            />
          )}
        </ContentTokensWrapper>
      </Content>
      {mode === "EDIT" && (
        <PanelsWrapper>
          <VariantsSelection
            tokenId={null}
            projectId={projectId}
            isTall={true}
            isRotatedWhenClosed
            isOpen={isVariantsSelectionPanelOpen}
            $isOpen={isVariantsSelectionPanelOpen}
            togglePanelVisibility={toggleVariantsSelectionPanelVisibility}
            onGroupedVariantSelectionSubmit={async () => {}}
          />
        </PanelsWrapper>
      )}
      <PanelsWrapper>
        <SignificantVariants
          isRotatedWhenClosed={!isInsignificantVariantsPanelOpen || mode === "READ"}
          isOpen={isSignificantVariantsPanelOpen}
          $isOpen={isSignificantVariantsPanelOpen}
          togglePanelVisibility={toggleSignificantVariantsPanelVisibility}
          projectId={projectId}
          isTall={!isInsignificantVariantsPanelOpen || mode === "READ"}
        />
        {mode === "EDIT" && (
          <InsignificantVariants
            isRotatedWhenClosed={!isSignificantVariantsPanelOpen}
            isOpen={isInsignificantVariantsPanelOpen}
            $isOpen={isInsignificantVariantsPanelOpen}
            togglePanelVisibility={toggleInsignificantVariantsPanelVisibility}
            projectId={projectId}
            isTall={!isSignificantVariantsPanelOpen}
          />
        )}
      </PanelsWrapper>
    </Layout>
  );
}

function View({
  tokens,
  isLoading,
  isError,
  projectId,
  refetch,
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  isVariantsSelectionPanelOpen,
  toggleInsignificantVariantsPanelVisibility,
  toggleSignificantVariantsPanelVisibility,
  toggleVariantsSelectionPanelVisibility,
}: ViewProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(
    tokens.find(token => token.state !== "one_variant")?.id || null,
  );

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
        <ContentTopBar />
        <MaskWrapper>
          {isLoading && <MaskLoader text={t("project.loader_text")} withBackgroundMask />}
          {isError && (
            <MaskError
              text={t("project.loader_text")}
              refetch={refetch}
              buttonText={t("project.refresh")}
              withBackgroundMask
            />
          )}
          <ContentTokensWrapper>
            {tokens.length === 0 && <Typography>{t("project.no_tokens_message")}</Typography>}
            {tokens.map(token => (
              <Token
                data-testid="token"
                key={token.id}
                token={token}
                mode={mode}
                onSelectToken={handleSelectToken}
                highlighted={token.id === selectedTokenId}
              />
            ))}
          </ContentTokensWrapper>
        </MaskWrapper>
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
            onGroupedVariantSelectionSubmit={async () => {
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
        />
        {mode === "EDIT" && (
          <InsignificantVariants
            $isOpen={isInsignificantVariantsPanelOpen}
            isOpen={isInsignificantVariantsPanelOpen}
            togglePanelVisibility={toggleInsignificantVariantsPanelVisibility}
            projectId={projectId}
            isRotatedWhenClosed={!isSignificantVariantsPanelOpen}
            isTall={!isSignificantVariantsPanelOpen}
          />
        )}
      </PanelsWrapper>
    </Layout>
  );
}

function ProjectView({ project }: ProjectViewProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();
  const { data, isLoading, isError, isFetching, isRefetching, refetch } =
    useGetTokensForProjectById({
      projectId: project.id,
      mode,
    });
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

  const tokens = data?.records;

  if (isLoading && !tokens && !isRefetching) {
    return (
      <Mask
        variant="loader"
        refetch={refetch}
        projectId={project.id}
        isSignificantVariantsPanelOpen={isSignificantVariantsPanelOpen}
        toggleSignificantVariantsPanelVisibility={toggleSignificantVariantsPanelVisibility}
        isInsignificantVariantsPanelOpen={isInsignificantVariantsPanelOpen}
        toggleInsignificantVariantsPanelVisibility={toggleInsignificantVariantsPanelVisibility}
        isVariantsSelectionPanelOpen={isVariantsSelectionPanelOpen}
        toggleVariantsSelectionPanelVisibility={toggleVariantsSelectionPanelVisibility}
      />
    );
  }

  if (isError && !tokens) {
    return (
      <Mask
        variant="error"
        refetch={refetch}
        buttonText={t("project.refresh")}
        projectId={project.id}
        isSignificantVariantsPanelOpen={isSignificantVariantsPanelOpen}
        toggleSignificantVariantsPanelVisibility={toggleSignificantVariantsPanelVisibility}
        isInsignificantVariantsPanelOpen={isInsignificantVariantsPanelOpen}
        toggleInsignificantVariantsPanelVisibility={toggleInsignificantVariantsPanelVisibility}
        isVariantsSelectionPanelOpen={isVariantsSelectionPanelOpen}
        toggleVariantsSelectionPanelVisibility={toggleVariantsSelectionPanelVisibility}
      />
    );
  }

  if (tokens && project) {
    return (
      <View
        tokens={tokens}
        isLoading={isFetching || isRefetching}
        isError={isError && !isRefetching}
        projectId={project.id}
        refetch={refetch}
        isSignificantVariantsPanelOpen={isSignificantVariantsPanelOpen}
        toggleSignificantVariantsPanelVisibility={toggleSignificantVariantsPanelVisibility}
        isInsignificantVariantsPanelOpen={isInsignificantVariantsPanelOpen}
        toggleInsignificantVariantsPanelVisibility={toggleInsignificantVariantsPanelVisibility}
        isVariantsSelectionPanelOpen={isVariantsSelectionPanelOpen}
        toggleVariantsSelectionPanelVisibility={toggleVariantsSelectionPanelVisibility}
      />
    );
  }

  return null;
}

export default ProjectView;
