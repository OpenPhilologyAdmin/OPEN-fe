import { useTranslation } from "next-i18next";

import DeleteIcon from "@/assets/images/icons/trash-2.svg";
import Button from "@/components/ui/button";
import Modal, { useModal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import NewTypography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useInvalidateGetCommentsForTokenById } from "../query";
import { useDeleteCommentById } from "./query";

export type DeleteCommentButtonProps = {
  disabled: boolean;
  projectId: number;
  tokenId: number | null;
  commentId: number;
};

const ModalContent = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 24px;
  text-align: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
`;

function DeleteCommentButton({
  disabled,
  commentId,
  projectId,
  tokenId,
}: DeleteCommentButtonProps) {
  const { isOpen: isModalOpen, toggleModalVisibility } = useModal();
  const { t } = useTranslation();
  const { invalidateGetCommentsForTokenById } = useInvalidateGetCommentsForTokenById();

  const { mutate: deleteCommentById } = useDeleteCommentById({
    onSuccess: ({ data: { message } }) => {
      toast.success(<NewTypography>{message}</NewTypography>);
      toggleModalVisibility();
      invalidateGetCommentsForTokenById(projectId, tokenId);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) {
        toast.error(<NewTypography>{apiError.error}</NewTypography>);
      }
    },
  });

  return (
    <>
      <Button
        data-testid="delete-comment-button"
        mode="icon"
        variant="tertiary"
        small
        onClick={toggleModalVisibility}
        disabled={disabled}
        destruct
      >
        <DeleteIcon />
      </Button>
      <Modal
        style={{ content: { height: "200px" } }}
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Delete Comment"
      >
        <ModalContent>
          <NewTypography>{t("project.delete_comment_question")}</NewTypography>
          <ButtonsWrapper>
            <Button
              onClick={() => deleteCommentById({ projectId, tokenId, commentId })}
              disabled={disabled}
            >
              {t("project.delete_comment_confirm")}
            </Button>
            <Button variant="secondary" onClick={toggleModalVisibility} disabled={disabled}>
              {t("project.delete_comment_cancel")}
            </Button>
          </ButtonsWrapper>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteCommentButton;
