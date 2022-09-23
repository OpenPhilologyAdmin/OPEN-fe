import {
  addWitnessEndpointHandlerGenericException,
  addWitnessMessage,
} from "@/mocks/handlers/witness-list";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import AddWitnessButton, { AddWitnessFormProps } from "..";

const project: API.Project = {
  id: 1,
  name: "string",
  default_witness: "A",
  witnesses: [
    {
      id: "AS",
      name: "Lorem ipsum",
      siglum: "AS",
      default: false,
    },
  ],
  witnesses_count: 0,
  status: "processing",
  created_by: "John Doe",
  creator_id: 1,
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_by: "John Doe",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  import_errors: {},
};

function AddWitnessButtonWithMockToastProvider(props: AddWitnessFormProps) {
  return (
    <>
      <MockToastProvider />
      <AddWitnessButton {...props} />
    </>
  );
}

describe("AddWitnessButton", () => {
  it("renders correctly and creates a witness on submit with success", async () => {
    const user = userEvent.setup();

    render(<AddWitnessButtonWithMockToastProvider project={project} disabled={false} />);

    const addButton = screen.getByRole("button", { name: "add_witness.open_modal_button" });

    await user.click(addButton);

    const witnessNameField = screen.getByLabelText("add_witness.witness_name");

    await user.type(witnessNameField, "abcd");

    const siglumField = screen.getByLabelText("add_witness.siglum");

    await user.type(siglumField, "ab");

    const confirmButton = screen.getByRole("button", { name: "add_witness.submit" });

    await user.click(confirmButton);

    expect(await screen.findByText(addWitnessMessage)).toBeInTheDocument();
  });
  //there are different types of failures fro backend, should they all be tested ?
  it("renders correctly and returns failure from submit request", async () => {
    mockServer.use(addWitnessEndpointHandlerGenericException);

    const user = userEvent.setup();

    render(<AddWitnessButtonWithMockToastProvider project={project} disabled={false} />);

    const addButton = screen.getByRole("button", { name: "add_witness.open_modal_button" });

    await user.click(addButton);

    const witnessNameField = screen.getByLabelText("add_witness.witness_name");

    await user.type(witnessNameField, "abcd");

    const siglumField = screen.getByLabelText("add_witness.siglum");

    await user.type(siglumField, "abcd");

    const confirmButton = screen.getByRole("button", { name: "add_witness.submit" });

    await user.click(confirmButton);

    // expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and does not create a witness on cancel", async () => {
    const user = userEvent.setup();

    render(<AddWitnessButtonWithMockToastProvider project={project} disabled={false} />);

    const addButton = screen.getByRole("button", { name: "add_witness.open_modal_button" });

    await user.click(addButton);

    const cancelButton = screen.getByRole("button", { name: "add_witness.cancel" });

    await user.click(cancelButton);

    expect(screen.queryByText(addWitnessMessage)).not.toBeInTheDocument();
  });
});
