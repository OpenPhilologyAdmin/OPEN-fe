import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "next-i18next";

import EditIcon from "@/assets/images/icons/edit-2.svg";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import NewTypography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useInvalidateGetCommentsForTokenById } from "../query";
import { useEditCommentById } from "./query";

export type EditCommentButtonProps = {
  disabled: boolean;
  projectId: number;
  tokenId: number | null;
  commentId: number;
  initialBody: string;
  editedCommentId: null | number;
  setEditedComment: Dispatch<SetStateAction<null | number>>;
  setEditedCommentBody: Dispatch<SetStateAction<string>>;
  addedCommentBody: string;
  setAddedCommentBody: Dispatch<SetStateAction<string>>;
  toggleShowCommentField: () => void;
  editedCommentBody: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const ButtonWrapper = styled.div<{ isEditing: boolean }>`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  position: relative;
  ${({ isEditing }) => !isEditing && "top: 40px"};
`;

const StyledButton = styled(Button)`
  margin: 0 12px 0 0;
`;

const TextAreaWrapper = styled.div<{ isEditing: boolean }>`
  position: relative;
  width: 205px;
  ${({ isEditing }) => !isEditing && "top: 45px"};
`;

const EditingWrapper = styled.div`
  margin-top: 10px;
`;

function EditCommentButton({
  disabled,
  commentId,
  projectId,
  tokenId,
  initialBody,
  editedCommentId,
  setEditedComment,
  setEditedCommentBody,
  editedCommentBody,
  setAddedCommentBody,
  addedCommentBody,
  toggleShowCommentField,
}: EditCommentButtonProps) {
  const { t } = useTranslation();
  const { invalidateGetCommentsForTokenById } = useInvalidateGetCommentsForTokenById();

  const { mutate: editCommentById } = useEditCommentById({
    onSuccess: () => {
      toggleShowCommentField();
      setAddedCommentBody(addedCommentBody);
      toggleShowCommentField();
      toast.success(<NewTypography>{t("project.edit_comment_success")}</NewTypography>);
      invalidateGetCommentsForTokenById(projectId, tokenId);
      setEditedComment(null);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) {
        toast.error(<NewTypography>{apiError.error}</NewTypography>);
      }
    },
  });

  const handleEdit = () => {
    setEditedComment(commentId);
    setEditedCommentBody(initialBody);
  };

  const isEditing = editedCommentId === commentId;

  return (
    <>
      {!isEditing ? (
        <Button
          data-testid="edit-comment-button"
          mode="icon"
          variant="tertiary"
          small
          onClick={handleEdit}
          disabled={disabled}
        >
          <EditIcon />
        </Button>
      ) : (
        <EditingWrapper>
          <TextAreaWrapper isEditing={isEditing}>
            <TextArea
              label={t("project.edit_comment_label")}
              value={editedCommentBody}
              onChange={event => setEditedCommentBody(event.currentTarget.value)}
              resize
              current={editedCommentBody.length}
              maxLength={250}
            />
          </TextAreaWrapper>
          <ButtonWrapper isEditing={isEditing}>
            <StyledButton
              small
              variant="primary"
              onClick={() =>
                editCommentById({ projectId, tokenId, commentId, body: editedCommentBody })
              }
            >
              {t("project.edit_comment_confirm")}
            </StyledButton>
            <Button small variant="secondary" onClick={() => setEditedComment(null)}>
              {t("project.edit_comment_cancel")}
            </Button>
          </ButtonWrapper>
        </EditingWrapper>
      )}
    </>
  );
}

export default EditCommentButton;
