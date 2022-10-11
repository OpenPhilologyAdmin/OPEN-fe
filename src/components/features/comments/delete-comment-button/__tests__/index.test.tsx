import { deleteCommentByIdException, errorGeneric, message } from "@/mocks/handlers/project";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import DeleteCommentButton, { DeleteCommentButtonProps } from "..";

const projectId = 0;
const tokenId = 0;

function DeleteCommentButtonWithMockToastProvider(props: DeleteCommentButtonProps) {
  return (
    <>
      <MockToastProvider />
      <DeleteCommentButton {...props} />
    </>
  );
}

describe("DeleteCommentButton", () => {
  it("renders correctly and deletes a comment on confirm", async () => {
    const user = userEvent.setup();

    render(
      <DeleteCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "project.delete_comment_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("renders correctly and does not delete a comment on cancel", async () => {
    const user = userEvent.setup();

    render(
      <DeleteCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "project.delete_comment_cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it("renders correctly and does not open a delete comment Textarea when disabled", async () => {
    const user = userEvent.setup();

    render(
      <DeleteCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={true}
        tokenId={tokenId}
        commentId={0}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    expect(screen.queryByText("project.delete_comment_cancel")).not.toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to delete comment", async () => {
    mockServer.use(deleteCommentByIdException);

    const user = userEvent.setup();

    render(
      <DeleteCommentButtonWithMockToastProvider
        projectId={projectId}
        disabled={false}
        tokenId={tokenId}
        commentId={0}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "project.delete_comment_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });
});
