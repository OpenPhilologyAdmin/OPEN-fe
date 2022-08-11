import { useTranslation } from "next-i18next";

import { MaskError, MaskLoader } from "@/components/ui/mask";
import { usePanel } from "@/components/ui/panel";
import Sup from "@/components/ui/sup";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

import SignificantVariants from "../significant-variants";
import { useGetTokensForProjectById } from "./query";

type ReadModeProps = {
  project: API.Project;
};

type ViewProps = {
  isLoading: boolean;
  isError: boolean;
  tokens: API.Token[];
  projectId: number;
  refetch: () => void;
};

type MaskProps = {
  projectId?: number;
  variant: "loader" | "error";
  buttonText?: string;
  refetch?: () => void;
};

type LayoutProps = {
  asideSize: "big" | "small";
};

const Layout = styled.div<LayoutProps>`
  display: grid;
  grid-template-columns: ${({ asideSize }) => (asideSize === "small" ? "1fr 58px" : "1fr 270px")};
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const Panel = styled.div`
  height: 100%;
  width: 100%;
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

const Token = styled(Typography)`
  margin-right: 4px;
`;

function Mask({ variant, buttonText, refetch, projectId }: MaskProps) {
  const { t } = useTranslation();
  const { isOpen, togglePanelVisibility } = usePanel();

  return (
    <Layout asideSize="big">
      <Content>
        <ContentTopBar></ContentTopBar>
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
      <Panel>
        {projectId && (
          <SignificantVariants
            isOpen={isOpen}
            togglePanelVisibility={togglePanelVisibility}
            projectId={projectId}
          />
        )}
      </Panel>
    </Layout>
  );
}

function View({ tokens, isLoading, isError, projectId, refetch }: ViewProps) {
  const { isOpen, togglePanelVisibility } = usePanel();
  const { t } = useTranslation();

  return (
    <Layout asideSize={isOpen ? "big" : "small"}>
      <Content>
        <ContentTopBar>{/* Placeholder */}</ContentTopBar>
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
              <Token key={token.id}>
                {token.t}
                {token.apparatus_index && <Sup>(1)</Sup>}
              </Token>
            ))}
          </ContentTokensWrapper>
        </MaskWrapper>
      </Content>
      <Panel>
        <SignificantVariants
          isOpen={isOpen}
          togglePanelVisibility={togglePanelVisibility}
          projectId={projectId}
        />
      </Panel>
    </Layout>
  );
}

function ReadMode({ project }: ReadModeProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isFetching, isRefetching, refetch } =
    useGetTokensForProjectById({
      projectId: project.id,
    });
  const tokens = data?.records;

  if (isLoading && !tokens && !isRefetching) {
    return <Mask variant="loader" projectId={project.id} />;
  }

  if (isError && !tokens) {
    return (
      <Mask
        variant="error"
        refetch={refetch}
        buttonText={t("project.refresh")}
        projectId={project.id}
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
      />
    );
  }

  return null;
}

export default ReadMode;
