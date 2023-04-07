import React, { ComponentPropsWithoutRef, Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

import DialogueIcon from "@/assets/images/icons/dialogue.svg";
import Button from "@/components/ui/button";
import ProjectPanel from "@/components/ui/project-panel";
import TextArea from "@/components/ui/textarea";
import Tooltip from "@/components/ui/tooltip";
import { useTooltip } from "@/components/ui/tooltip/use-tooltip";
import NewTypography from "@/components/ui/typography/new_index";
import { useUser } from "@/hooks/use-user";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import dayjs from "dayjs";
import styled, { css } from "styled-components";

import DeleteCommentButton from "./delete-comment-button";
import EditCommentButton from "./edit-comment-button";
import {
  useAddComment,
  useGetCommentsForTokenById,
  useInvalidateGetCommentsForTokenById,
} from "./query";

type CommentsProps = ComponentPropsWithoutRef<"div"> & {
  projectId: number;
  tokenId: number | null;
  isOpen: boolean;
  togglePanelVisibility: () => void;
  isRotatedWhenClosed: boolean;
};

type PanelContentProps = {
  comments?: API.Comment[];
  projectId: number;
  tokenId: number | null;
  isAddCommentFieldShown: boolean;
  toggleShowCommentField: () => void;
  editedCommentId: number | null;
  setEditedComment: Dispatch<SetStateAction<number | null>>;
  setEditedCommentBody: Dispatch<SetStateAction<string>>;
  editedCommentBody: string;
  addedCommentBody: string;
  setAddedCommentBody: Dispatch<SetStateAction<string>>;
};

const CommentWrapper = styled(NewTypography)`
  white-space: pre-wrap;
`;

const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 8px 0;
`;

const EditIconWrapper = styled.div<{ isEditing: boolean; isDeleteIconHidden: boolean }>`
  ${({ isEditing }) =>
    isEditing &&
    css`
      position: absolute;
      right: 70px;
    `};
  ${({ isDeleteIconHidden }) =>
    isDeleteIconHidden &&
    css`
      position: absolute;
      right: 33px;
    `};
`;

const DeleteIconWrapper = styled.div<{ isHidden: boolean }>`
  position: absolute;
  right: 32px;
  display: ${({ isHidden }) => (isHidden ? "none" : "static")};
`;

const AddCommentIconWrapper = styled.div`
  width: auto;
  margin: 10px 0 0 0;
`;

const CommentAuthor = styled(NewTypography).attrs({
  variant: "strong",
  compact: true,
  shrink: true,
  bold: true,
})`
  margin: 0 0 4px 0;
  font-family: "Inter";
  overflow: hidden;
  text-overflow: ellipsis;
  width: 135px;
  white-space: nowrap;
`;

const CommentCreatedAt = styled(NewTypography).attrs({ variant: "tiny" })`
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const StyledButton = styled(Button)`
  margin: 0 12px 0 0;
`;

const CommentTextWrapper = styled.div`
  margin: 0 0 12px 0;
`;

const formatDate = (date: string) => dayjs(date).format("DD-MM-YYYY");

function PanelContent({
  comments,
  projectId,
  tokenId,
  toggleShowCommentField,
  isAddCommentFieldShown,
  editedCommentId,
  setEditedComment,
  setEditedCommentBody,
  editedCommentBody,
  setAddedCommentBody,
  addedCommentBody,
}: PanelContentProps) {
  const { t } = useTranslation();
  const { invalidateGetCommentsForTokenById } = useInvalidateGetCommentsForTokenById();
  const { handleShowToolTip, handleHideTooltip, isTooltipVisible } = useTooltip();

  const { user } = useUser();

  const { mutate: addComment } = useAddComment({
    onSuccess: () => {
      toast.success(<NewTypography>{t("project.add_comment_success")}</NewTypography>);
      invalidateGetCommentsForTokenById(projectId, tokenId);
      toggleShowCommentField();
      setAddedCommentBody("");
      setEditedCommentBody(editedCommentBody);
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError?.error) {
        toast.error(<NewTypography>{apiError.error}</NewTypography>);
      }
    },
  });

  return (
    <CommentListWrapper>
      {!comments || comments.length === 0 ? (
        <CommentTextWrapper>
          <NewTypography>{t("project.no_comments_message")}</NewTypography>
        </CommentTextWrapper>
      ) : (
        comments.map(comment => (
          <React.Fragment key={comment.id}>
            <CommentTextWrapper>
              <TitleWrapper>
                <CommentAuthor>{comment.created_by}</CommentAuthor>
                <CommentCreatedAt>{formatDate(comment.created_at)}</CommentCreatedAt>
                <EditIconWrapper
                  isDeleteIconHidden={comment.user_id !== user?.id}
                  isEditing={comment.id !== editedCommentId}
                  onMouseEnter={handleShowToolTip}
                  onMouseLeave={handleHideTooltip}
                  data-tip={
                    !!comment.last_edit_at
                      ? `${t("project.edit_comment_tooltip")} ${formatDate(comment.last_edit_at)}`
                      : t("project.edit_comment_not_edited")
                  }
                >
                  <EditCommentButton
                    initialBody={comment.body}
                    disabled={comment.user_id !== user?.id}
                    projectId={projectId}
                    tokenId={tokenId}
                    commentId={comment.id}
                    editedCommentId={editedCommentId}
                    setEditedComment={setEditedComment}
                    setEditedCommentBody={setEditedCommentBody}
                    editedCommentBody={editedCommentBody}
                    setAddedCommentBody={setAddedCommentBody}
                    addedCommentBody={addedCommentBody}
                    toggleShowCommentField={toggleShowCommentField}
                  />
                </EditIconWrapper>
                {editedCommentId !== comment.id && (
                  <DeleteIconWrapper isHidden={comment.user_id !== user?.id}>
                    <DeleteCommentButton
                      disabled={false}
                      projectId={projectId}
                      tokenId={tokenId}
                      commentId={comment.id}
                    />
                  </DeleteIconWrapper>
                )}
              </TitleWrapper>
              {editedCommentId !== comment.id && (
                <CommentWrapper variant="small">{comment.body}</CommentWrapper>
              )}
            </CommentTextWrapper>
          </React.Fragment>
        ))
      )}
      {!isAddCommentFieldShown ? (
        <AddCommentIconWrapper>
          <Button small variant="primary" onClick={() => toggleShowCommentField()}>
            {t("project.add_comment_icon")}
          </Button>
        </AddCommentIconWrapper>
      ) : (
        <>
          <TextArea
            label={t("project.add_comment_label")}
            onChange={event => setAddedCommentBody(event.currentTarget.value)}
            current={addedCommentBody.length}
            maxLength={250}
            value={addedCommentBody}
            resize
          />
          <ButtonWrapper>
            <StyledButton
              small
              variant="primary"
              onClick={() => addComment({ projectId, tokenId, body: addedCommentBody })}
            >
              {t("project.add_comment_confirm")}
            </StyledButton>
            <Button
              small
              variant="secondary"
              onClick={() => {
                setAddedCommentBody("");
                toggleShowCommentField();
              }}
            >
              {t("project.add_comment_cancel")}
            </Button>
          </ButtonWrapper>
        </>
      )}
      <Tooltip place="left" isTooltipVisible={!editedCommentId && isTooltipVisible} />
    </CommentListWrapper>
  );
}

function Comments({
  isOpen,
  projectId,
  tokenId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  ...props
}: CommentsProps) {
  const { t } = useTranslation();
  const {
    data: comments,
    isLoading,
    isError,
    isRefetching,
    isFetching,
    refetch,
  } = useGetCommentsForTokenById({
    projectId,
    tokenId,
  });

  const [isAddCommentFieldShown, showAddCommentField] = useState(false);
  const [editedCommentId, setEditedComment] = useState<number | null>(null);
  const [editedCommentBody, setEditedCommentBody] = useState<string>("");
  const [addedCommentBody, setAddedCommentBody] = useState<string>("");

  const toggleShowCommentField = () => {
    showAddCommentField(prevState => !prevState);
  };

  const commentsLength = comments?.length || 0;
  const heading = `${t("project.comments")} 9${commentsLength})`;

  return (
    <ProjectPanel
      isOpen={isOpen}
      isError={isError && !comments}
      isLoading={isLoading && !comments}
      isFetching={isFetching}
      isRefetching={isRefetching}
      isRotatedWhenClosed={isRotatedWhenClosed}
      heading={heading}
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
          onClick={toggleShowCommentField}
          disabled={isAddCommentFieldShown && !editedCommentId}
        >
          <DialogueIcon />
        </Button>
      }
      {...props}
    >
      {!tokenId ? (
        <NewTypography>{t("project.select_comment")}</NewTypography>
      ) : (
        <PanelContent
          comments={comments}
          projectId={projectId}
          tokenId={tokenId}
          toggleShowCommentField={toggleShowCommentField}
          isAddCommentFieldShown={isAddCommentFieldShown}
          editedCommentId={editedCommentId}
          setEditedComment={setEditedComment}
          editedCommentBody={editedCommentBody}
          setEditedCommentBody={setEditedCommentBody}
          addedCommentBody={addedCommentBody}
          setAddedCommentBody={setAddedCommentBody}
        />
      )}
    </ProjectPanel>
  );
}

export default Comments;
