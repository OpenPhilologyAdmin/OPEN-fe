import { useTranslation } from "next-i18next";

import DeleteIcon from "@/assets/images/icons/trash-2.svg";
import Button from "@/components/ui/button";
import Modal, { useModal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useInvalidateGetWitnessListByProjectId } from "../query";
import { useDeleteWitnessById } from "./query";

export type DeleteWitnessButtonProps = {
  disabled?: boolean;
  projectId: number;
  witnessId: string;
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

function DeleteWitnessButton({ disabled = false, projectId, witnessId }: DeleteWitnessButtonProps) {
  const { isOpen: isModalOpen, toggleModalVisibility } = useModal();
  const { invalidateGetWitnessListByProjectId } = useInvalidateGetWitnessListByProjectId();
  const { t } = useTranslation();

  const { mutate: deleteWitnessById } = useDeleteWitnessById({
    onSuccess: ({ data: { message } }) => {
      invalidateGetWitnessListByProjectId({ projectId });
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
        destruct
        onClick={toggleModalVisibility}
        disabled={disabled}
      >
        <DeleteIcon />
      </Button>
      <Modal isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
        <ModalContent>
          <Typography>{t("witness_list.delete_description")}</Typography>
          <Typography>{t("witness_list.delete_question")}</Typography>
          <ButtonsWrapper>
            <Button onClick={() => deleteWitnessById({ projectId, witnessId })} disabled={disabled}>
              {t("witness_list.delete_confirm")}
            </Button>
            <Button variant="secondary" onClick={toggleModalVisibility} disabled={disabled}>
              {t("witness_list.delete_cancel")}
            </Button>
          </ButtonsWrapper>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteWitnessButton;
