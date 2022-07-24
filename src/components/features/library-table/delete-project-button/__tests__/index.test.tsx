import {
  deleteProjectByIdHandlerGenericException,
  errorGeneric,
  message,
} from "@/mocks/handlers/library";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import DeleteProjectButton, { DeleteProjectButtonProps } from "..";

const projectId = 0;

function DeleteProjectButtonWithMockToastProvider(props: DeleteProjectButtonProps) {
  return (
    <>
      <MockToastProvider />
      <DeleteProjectButton {...props} />
    </>
  );
}

describe("DeleteProjectButton", () => {
  it("renders correctly and deletes the project on confirm", async () => {
    const user = userEvent.setup();

    render(<DeleteProjectButtonWithMockToastProvider projectId={projectId} disabled={false} />);

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "library.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("renders correctly and does not delete the project on cancel", async () => {
    const user = userEvent.setup();

    render(<DeleteProjectButtonWithMockToastProvider projectId={projectId} disabled={false} />);

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "library.delete_cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it("renders correctly and does not open a delete modal when disabled", async () => {
    const user = userEvent.setup();

    render(<DeleteProjectButtonWithMockToastProvider projectId={projectId} disabled />);

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    expect(screen.queryByText("library.delete_title")).not.toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to delete project", async () => {
    mockServer.use(deleteProjectByIdHandlerGenericException);

    const user = userEvent.setup();

    render(<DeleteProjectButtonWithMockToastProvider projectId={projectId} disabled={false} />);

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "library.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });
});
