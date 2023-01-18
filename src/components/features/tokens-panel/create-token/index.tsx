import { useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled, { css } from "styled-components";

import { useEditTokensByProjectId, useGetTokenEditedInfoForProjectById } from "./query";

const ERROR_FIELDS = ["project", "selected_token_ids"];

type PanelContentProps = {
  projectId: number;
  isCreating: boolean;
  selectedTokensForCreation: API.Token[];
  toggleSelectionAvailability: () => void;
  invalidateProjectViewQueriesCallback: () => Promise<void>;
  handleReset: () => void;
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

function CreateToken({
  projectId,
  selectedTokensForCreation,
  toggleSelectionAvailability,
  invalidateProjectViewQueriesCallback,
  handleReset,
}: PanelContentProps) {
  const { t } = useTranslation();
  // TODO error and loading
  const { refetch, remove } = useGetTokenEditedInfoForProjectById({
    projectId,
    tokenIds: selectedTokensForCreation.map(token => token.id),
    enabled: false,
  });
  const { mutate: editTokensByProjectId, isLoading } = useEditTokensByProjectId({
    onSuccess: async ({ data: { message } }) => {
      toast.success(<Typography>{message}</Typography>);
      await invalidateProjectViewQueriesCallback();
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
          selected_token_ids: selectedTokensForCreation.map(token => token.id),
        },
      },
    });

    toggleSelectionAvailability();
    remove();
    handleReset();
  };

  return (
    <Wrapper>
      <>
        <div>
          {selectedTokensForCreation.length === 0 ? (
            <Typography>{t("project.no_selection")}</Typography>
          ) : (
            <>
              {selectedTokensForCreation.map(token => (
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
            disabled={isLoading || selectedTokensForCreation.length === 0}
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
            onClick={() => {
              toggleSelectionAvailability();
              handleReset();
            }}
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
    </Wrapper>
  );
}

export default CreateToken;
