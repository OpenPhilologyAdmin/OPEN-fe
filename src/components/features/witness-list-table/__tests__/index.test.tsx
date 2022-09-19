import {
  errorGeneric,
  getWitnessListByProjectIdException,
  message,
  project,
} from "@/mocks/handlers/witness-list";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import WitnessListTable from "..";

function WitnessListTableWithMockToastProvider() {
  return (
    <>
      <MockToastProvider />
      <WitnessListTable project={project} />
    </>
  );
}

describe("WitnessListTable", () => {
  it("renders correctly and shows generic backend error when the witness list is not fetched", async () => {
    mockServer.use(getWitnessListByProjectIdException);

    render(<WitnessListTableWithMockToastProvider />);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and deletes the witness", async () => {
    const user = userEvent.setup();

    render(<WitnessListTableWithMockToastProvider />);

    const [deleteButton] = await screen.findAllByTestId("delete-button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "witness_list.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it("renders correctly the number of witness records received from the backend", async () => {
    render(<WitnessListTableWithMockToastProvider />);

    const rows = await screen.findAllByTestId("row");

    expect(rows.length).toEqual(2);
  });

  it("renders correctly and updates the witness name", async () => {
    const user = userEvent.setup();

    render(<WitnessListTableWithMockToastProvider />);

    const [editButton] = await screen.findAllByTestId("edit-button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, "name");

    const submitButton = screen.getByTestId("submit-button");

    await user.click(submitButton);

    expect(await screen.findByText("witness_list.witness_name_changed")).toBeInTheDocument();
  });
});
