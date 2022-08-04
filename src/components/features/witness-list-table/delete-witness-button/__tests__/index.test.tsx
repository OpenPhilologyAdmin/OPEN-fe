import {
  deleteWitnessByIdEndpointHandlerGenericException,
  errorGeneric,
  message,
} from "@/mocks/handlers/witness-list";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import DeleteWitnessButton, { DeleteWitnessButtonProps } from "..";

const projectId = 0;
const witnessId = "AS";

function DeleteWitnessButtonWithMockToastProvider(props: DeleteWitnessButtonProps) {
  return (
    <>
      <MockToastProvider />
      <DeleteWitnessButton {...props} />
    </>
  );
}

describe("DeleteWitnessButton", () => {
  it("renders correctly and deletes the witness on confirm", async () => {
    const user = userEvent.setup();

    render(
      <DeleteWitnessButtonWithMockToastProvider
        projectId={projectId}
        witnessId={witnessId}
        disabled={false}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "witness_list.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("renders correctly and does not delete the witness on cancel", async () => {
    const user = userEvent.setup();

    render(
      <DeleteWitnessButtonWithMockToastProvider
        projectId={projectId}
        witnessId={witnessId}
        disabled={false}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const cancelButton = screen.getByRole("button", { name: "witness_list.delete_cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it("renders correctly and does not open a delete modal when disabled", async () => {
    const user = userEvent.setup();

    render(
      <DeleteWitnessButtonWithMockToastProvider
        projectId={projectId}
        witnessId={witnessId}
        disabled
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    expect(screen.queryByText("witness_list.delete_title")).not.toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to delete project", async () => {
    mockServer.use(deleteWitnessByIdEndpointHandlerGenericException);

    const user = userEvent.setup();

    render(
      <DeleteWitnessButtonWithMockToastProvider
        projectId={projectId}
        witnessId={witnessId}
        disabled={false}
      />,
    );

    const deleteButton = screen.getByRole("button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "witness_list.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });
});
