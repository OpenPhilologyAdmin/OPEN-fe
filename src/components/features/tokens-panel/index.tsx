import { ComponentPropsWithoutRef } from "react";
import { useTranslation } from "next-i18next";

import PlusSmallIcon from "@/assets/images/icons/plus-small.svg";
import Button from "@/components/ui/button";
import ProjectPanel from "@/components/ui/project-panel";
import Typography from "@/components/ui/typography/new_index";
import styled from "styled-components";

import CreateToken from "./create-token";
import SplitToken from "./split-token";

type TokensPanelProps = ComponentPropsWithoutRef<"div"> & {
  isCreating: boolean;
  selectedTokenIdForSplit: number | null;
  selectedTokensForCreation: API.Token[];
  projectId?: number;
  isOpen: boolean;
  isRotatedWhenClosed: boolean;
  togglePanelVisibility: () => void;
  invalidateProjectViewQueriesCallback: () => Promise<void>;
  refetch: () => Promise<any>;
  toggleSelectionAvailability: () => void;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  handleReset: () => void;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BeforeCreateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

function TokensPanel({
  selectedTokensForCreation,
  selectedTokenIdForSplit,
  isOpen,
  projectId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  toggleSelectionAvailability,
  invalidateProjectViewQueriesCallback,
  isCreating,
  isError,
  isFetching,
  isLoading,
  isRefetching,
  refetch,
  handleReset,
  ...props
}: TokensPanelProps) {
  const { t } = useTranslation();

  if (!projectId) return null;

  const isSplitting = !!selectedTokenIdForSplit && !isCreating;

  return (
    <ProjectPanel
      isOpen={isOpen}
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isRotatedWhenClosed={isRotatedWhenClosed}
      heading={t("project.tokens")}
      buttonText={t("project.refresh")}
      errorText={t("project.generic_error")}
      loaderText={t("project.loader_text")}
      refetch={refetch}
      togglePanelVisibility={togglePanelVisibility}
      actionNode={
        <Button
          type="button"
          mode="icon"
          variant="secondary"
          small
          onClick={() => {
            toggleSelectionAvailability();
            handleReset();
          }}
          disabled={isCreating}
        >
          <PlusSmallIcon />
        </Button>
      }
      {...props}
    >
      <Wrapper>
        {isCreating ? (
          <CreateToken
            projectId={projectId}
            isCreating={isCreating}
            selectedTokensForCreation={selectedTokensForCreation}
            toggleSelectionAvailability={toggleSelectionAvailability}
            invalidateProjectViewQueriesCallback={invalidateProjectViewQueriesCallback}
            handleReset={handleReset}
          />
        ) : isSplitting ? (
          <SplitToken
            projectId={projectId}
            tokenId={selectedTokenIdForSplit}
            onCancel={handleReset}
            invalidateProjectViewQueriesCallback={invalidateProjectViewQueriesCallback}
          />
        ) : (
          <BeforeCreateWrapper>
            <Typography bold>{t("project.before_create_title")}</Typography>
            <Typography>{t("project.before_create_description")}</Typography>
            <Button onClick={toggleSelectionAvailability} small>
              {t("project.before_create_action")}
            </Button>
          </BeforeCreateWrapper>
        )}
      </Wrapper>
    </ProjectPanel>
  );
}

export default TokensPanel;
