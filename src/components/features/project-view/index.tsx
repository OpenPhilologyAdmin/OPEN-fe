import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import { usePanel } from "@/components/ui/panel";
import BaseToken from "@/components/ui/token";
import Typography from "@/components/ui/typography";
import { Mode } from "@/contexts/current-project-mode";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled, { css } from "styled-components";

import BaseInsignificantVariants from "../insignificant-variants";
import BaseSignificantVariants from "../significant-variants";
import { useGetTokensForProjectById } from "./query";

type ProjectViewProps = {
  project: API.Project;
};

type TallPanelProps = {
  isTall: boolean;
};

type ViewProps = {
  isLoading: boolean;
  isError: boolean;
  tokens: API.Token[];
  projectId: number;
  refetch: () => void;
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  toggleInsignificantVariantsPanelVisibility: () => void;
  toggleSignificantVariantsPanelVisibility: () => void;
};

type MaskProps = {
  projectId?: number;
  variant: "loader" | "error";
  buttonText?: string;
  refetch?: () => void;
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  toggleInsignificantVariantsPanelVisibility: () => void;
  toggleSignificantVariantsPanelVisibility: () => void;
};

type LayoutProps = {
  gridTemplateColumns: string;
};

type GetGridTemplateColumnsProps = {
  isSignificantVariantsPanelOpen: boolean;
  isInsignificantVariantsPanelOpen: boolean;
  mode: Mode;
};

const getGridTemplateColumns = ({
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  mode,
}: GetGridTemplateColumnsProps) => {
  if (mode === "READ") {
    return isSignificantVariantsPanelOpen ? "1fr 270px" : "1fr 58px";
  } else {
    if (isSignificantVariantsPanelOpen) {
      return "1fr 270px";
    }

    if (isInsignificantVariantsPanelOpen) {
      return "1fr 270px";
    }

    return "1fr 58px";
  }
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
  height: calc(100% - 36px);
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
  height: calc(100vh - 144px);
`;

const panelStyles = css<TallPanelProps>`
  flex-shrink: 0;
  overflow-y: scroll;
  max-height: 50%;
  max-height: ${({ isTall }) => (isTall ? "calc(100% - 32px)" : "50%")};
`;

const SignificantVariants = styled(BaseSignificantVariants)<TallPanelProps>`
  ${panelStyles}
`;
const InsignificantVariants = styled(BaseInsignificantVariants)<TallPanelProps>`
  ${panelStyles}
`;

function Mask({
  variant,
  buttonText,
  refetch,
  projectId,
  isInsignificantVariantsPanelOpen,
  isSignificantVariantsPanelOpen,
  toggleInsignificantVariantsPanelVisibility,
  toggleSignificantVariantsPanelVisibility,
}: MaskProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();

  return (
    <Layout
      gridTemplateColumns={getGridTemplateColumns({
        isInsignificantVariantsPanelOpen,
        isSignificantVariantsPanelOpen,
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
      <PanelsWrapper>
        <SignificantVariants
          isOpen={true}
          togglePanelVisibility={toggleSignificantVariantsPanelVisibility}
          projectId={projectId}
          isTall={false}
        />
        {mode === "EDIT" && (
          <InsignificantVariants
            isOpen={true}
            togglePanelVisibility={toggleInsignificantVariantsPanelVisibility}
            projectId={projectId}
            isTall={false}
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
  toggleInsignificantVariantsPanelVisibility,
  toggleSignificantVariantsPanelVisibility,
}: ViewProps) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();

  return (
    <Layout
      gridTemplateColumns={getGridTemplateColumns({
        isInsignificantVariantsPanelOpen,
        isSignificantVariantsPanelOpen,
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
              <Token key={token.id} token={token} mode={mode} />
            ))}
          </ContentTokensWrapper>
        </MaskWrapper>
      </Content>
      <PanelsWrapper>
        <SignificantVariants
          isOpen={isSignificantVariantsPanelOpen}
          togglePanelVisibility={toggleSignificantVariantsPanelVisibility}
          projectId={projectId}
          isRotatedWhenClosed={!isInsignificantVariantsPanelOpen || mode === "READ"}
          isTall={!isInsignificantVariantsPanelOpen || mode === "READ"}
        />
        {mode === "EDIT" && (
          <InsignificantVariants
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

  const tokens = data?.records;

  if (isLoading && !tokens && !isRefetching) {
    return (
      <Mask
        variant="loader"
        projectId={project.id}
        isSignificantVariantsPanelOpen={isSignificantVariantsPanelOpen}
        toggleSignificantVariantsPanelVisibility={toggleSignificantVariantsPanelVisibility}
        isInsignificantVariantsPanelOpen={isInsignificantVariantsPanelOpen}
        toggleInsignificantVariantsPanelVisibility={toggleInsignificantVariantsPanelVisibility}
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
      />
    );
  }

  if (tokens) {
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
      />
    );
  }

  return null;
}

export default ProjectView;
