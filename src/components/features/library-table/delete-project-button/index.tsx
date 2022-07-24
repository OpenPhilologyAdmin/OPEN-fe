import { useState } from "react";
import { useTranslation } from "next-i18next";

import DeleteIcon from "@/assets/images/icons/trash-2.svg";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useInvalidateProjectListQuery } from "../query";
import { useDeleteProjectById } from "./query";

export type DeleteProjectButtonProps = {
  disabled: boolean;
  projectId: number;
};

const ModalContent = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

function DeleteProjectButton({ disabled, projectId }: DeleteProjectButtonProps) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { invalidateProjectListQuery } = useInvalidateProjectListQuery();
  const { t } = useTranslation();

  const { mutate: deleteProjectById } = useDeleteProjectById({
    onSuccess: ({ data: { message } }) => {
      invalidateProjectListQuery();
      toast.success(<Typography>{message}</Typography>);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) {
        toast.error(<Typography>{apiError.error}</Typography>);
      }
    },
  });

  return (
    <>
      <Button
        data-testid="delete-button"
        mode="icon"
        variant="tertiary"
        small
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
        <DeleteIcon />
      </Button>
      <Modal isOpen={modalIsOpen} shouldCloseOnOverlayClick={false} contentLabel="Example Modal">
        <ModalContent>
          <Typography>{t("library.delete_description")}</Typography>
          <Typography>{t("library.delete_question")}</Typography>
          <ButtonsWrapper>
            <Button onClick={() => deleteProjectById({ id: projectId })} disabled={disabled}>
              {t("library.delete_confirm")}
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={disabled}>
              {t("library.delete_cancel")}
            </Button>
          </ButtonsWrapper>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteProjectButton;
