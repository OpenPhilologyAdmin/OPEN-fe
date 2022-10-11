import { editCommentByIdException, errorGeneric, message } from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import EditCommentButton, { EditCommentButtonProps } from "..";

const projectId = 0;
const tokenId = 0;

function EditCommentButtonWithMockToastProvider(props: EditCommentButtonProps) {
  return (
    <>
      <MockToastProvider />
      <EditCommentButton {...props} />
    </>
  );
}

describe("EditCommentButton", () => {
  it("renders confirm button correctly", async () => {
    render(
      <EditCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
        initialBody={""}
        editedCommentId={null}
        setEditedComment={() => {}}
        setEditedCommentBody={() => {}}
        addedCommentBody={""}
        setAddedCommentBody={() => {}}
        toggleShowCommentField={() => {}}
        editedCommentBody={""}
      />,
    );

    expect(await screen.findByTestId("edit-comment-button")).toBeInTheDocument();
  });

  it("renders correctly and edits a comment on confirm", async () => {
    const user = userEvent.setup();

    render(
      <EditCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
        initialBody={""}
        editedCommentId={0}
        setEditedComment={() => {}}
        setEditedCommentBody={() => {}}
        addedCommentBody={""}
        setAddedCommentBody={() => {}}
        toggleShowCommentField={() => {}}
        editedCommentBody={""}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "project.edit_comment_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText("project.edit_comment_success")).toBeInTheDocument();
  });

  it("renders correctly and does not edit a comment on cancel", async () => {
    const user = userEvent.setup();
    const setEditedComment = jest.fn();

    render(
      <EditCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
        initialBody={""}
        editedCommentId={0}
        setEditedComment={setEditedComment}
        setEditedCommentBody={() => {}}
        addedCommentBody={""}
        setAddedCommentBody={() => {}}
        toggleShowCommentField={() => {}}
        editedCommentBody={""}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "project.edit_comment_cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it("renders correctly and does not open an edit comment Textarea when disabled", async () => {
    const user = userEvent.setup();

    render(
      <EditCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={true}
        tokenId={tokenId}
        commentId={0}
        initialBody={""}
        editedCommentId={null}
        setEditedComment={() => {}}
        setEditedCommentBody={() => {}}
        addedCommentBody={""}
        setAddedCommentBody={() => {}}
        toggleShowCommentField={() => {}}
        editedCommentBody={""}
      />,
    );

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    expect(screen.queryByText("project.edit_comment_cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("project.edit_comment_confirm")).not.toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to edit comment", async () => {
    mockServer.use(editCommentByIdException);

    const user = userEvent.setup();

    render(
      <EditCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
        initialBody={""}
        editedCommentId={0}
        setEditedComment={() => {}}
        setEditedCommentBody={() => {}}
        addedCommentBody={""}
        setAddedCommentBody={() => {}}
        toggleShowCommentField={() => {}}
        editedCommentBody={""}
      />,
    );

    const confirmButton = screen.getByRole("button", { name: "project.edit_comment_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });
});
