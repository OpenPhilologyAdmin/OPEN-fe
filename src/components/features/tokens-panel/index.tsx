import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import PlusSmallIcon from "@/assets/images/icons/plus-small.svg";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import ProjectPanel from "@/components/ui/project-panel";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled, { css } from "styled-components";

import { useEditTokensByProjectId, useGetTokenEditedInfoForProjectById } from "./query";

const ERROR_FIELDS = ["project", "selected_token_ids"];

type TokensPanelProps = ComponentPropsWithoutRef<"div"> & {
  isCreating: boolean;
  selectedTokens: API.Token[];
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
  onSave: () => void;
};

type PanelContentProps = {
  projectId: number;
  isCreating: boolean;
  selectedTokens: API.Token[];
  toggleSelectionAvailability: () => void;
  invalidateProjectViewQueriesCallback: () => Promise<void>;
  onSave: () => void;
};

type TypographyStyleProps = {
  $hasMoreVariants: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InlineButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const BeforeCreateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  justify-content: center;
`;

const TypographyWithForcedFont = styled(Typography)<TypographyStyleProps>`
  &&& {
    font-family: "Roboto Slab" !important;
    line-height: 24px;

    ${({ $hasMoreVariants }) =>
      $hasMoreVariants &&
      css`
        color: ${({ theme }) => theme.colors.actionsPrimary};
        font-weight: bold;
      `}
  }
`;

function PanelContent({
  projectId,
  selectedTokens,
  isCreating,
  toggleSelectionAvailability,
  invalidateProjectViewQueriesCallback,
  onSave,
}: PanelContentProps) {
  const { t } = useTranslation();
  const { refetch, remove } = useGetTokenEditedInfoForProjectById({
    projectId,
    tokenIds: selectedTokens.map(token => token.id),
    enabled: false,
  });
  const { mutate: editTokensByProjectId, isLoading } = useEditTokensByProjectId({
    onSuccess: async ({ data: { message } }) => {
      toast.success(<Typography>{message}</Typography>);
      invalidateProjectViewQueriesCallback();
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        ERROR_FIELDS.forEach(field => {
          if (apiError[field]) {
            apiError[field].forEach(error => {
              toast.error(<Typography>{error}</Typography>);
            });
          }
        });
      }
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async () => {
    editTokensByProjectId({
      projectId,
      data: {
        token: {
          selected_token_ids: selectedTokens.map(token => token.id),
        },
      },
    });

    toggleSelectionAvailability();
    remove();
    onSave();
  };

  return (
    <Wrapper>
      {isCreating ? (
        <>
          <div>
            {selectedTokens.length === 0 ? (
              <Typography>{t("project.no_selection")}</Typography>
            ) : (
              <>
                {selectedTokens.map(token => (
                  <TypographyWithForcedFont
                    key={token.id}
                    variant="regular"
                    $hasMoreVariants={token.state !== "one_variant"}
                  >
                    {token.t}
                  </TypographyWithForcedFont>
                ))}
              </>
            )}
          </div>

          <InlineButtonsWrapper>
            <Button
              small
              disabled={isLoading || selectedTokens.length === 0}
              isLoading={isLoading}
              onClick={async () => {
                const { data } = await refetch();

                if (
                  data?.data.comments ||
                  data?.data.editorial_remarks ||
                  data?.data.variants_selections
                ) {
                  setIsModalOpen(true);
                } else {
                  await handleSave();
                }
              }}
            >
              {t("project.save_token")}
            </Button>
            <Button
              variant="secondary"
              small
              onClick={toggleSelectionAvailability}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {t("project.cancel")}
            </Button>
          </InlineButtonsWrapper>
          <Modal isOpen={isModalOpen}>
            <ModalContent>
              <Typography>{t("project.token_before_create_warning")}</Typography>

              <InlineButtonsWrapper>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={async () => {
                    await handleSave();
                    setIsModalOpen(false);
                  }}
                >
                  {t("project.continue")}
                </Button>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    remove();
                  }}
                >
                  {t("project.cancel")}
                </Button>
              </InlineButtonsWrapper>
            </ModalContent>
          </Modal>
        </>
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
  );
}

function TokensPanel({
  selectedTokens,
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
  onSave,
  ...props
}: TokensPanelProps) {
  const { t } = useTranslation();

  if (!projectId) return null;

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
          onClick={toggleSelectionAvailability}
          disabled={isCreating}
        >
          <PlusSmallIcon />
        </Button>
      }
      {...props}
    >
      <PanelContent
        projectId={projectId}
        isCreating={isCreating}
        selectedTokens={selectedTokens}
        toggleSelectionAvailability={toggleSelectionAvailability}
        invalidateProjectViewQueriesCallback={invalidateProjectViewQueriesCallback}
        onSave={onSave}
      />
    </ProjectPanel>
  );
}

export default TokensPanel;
