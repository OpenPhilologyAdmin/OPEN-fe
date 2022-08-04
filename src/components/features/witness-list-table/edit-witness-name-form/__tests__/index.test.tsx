import {
  errorField,
  errorGeneric,
  updateWitnessByIdHandlerGenericException,
  updateWitnessByIdHandlerNameFieldException,
  witness,
} from "@/mocks/handlers/witness-list";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import EditWitnessNameForm, { EditWitnessNameFormProps } from "..";

const projectId = 0;
const name = "Name";

function EditWitnessNameFormWithMockToastProvider(props: EditWitnessNameFormProps) {
  return (
    <>
      <MockToastProvider />
      <EditWitnessNameForm {...props} />
    </>
  );
}

describe("EditWitnessNameForm", () => {
  it("renders correctly and updates the witness name", async () => {
    const user = userEvent.setup();

    render(
      <EditWitnessNameFormWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText("witness_list.witness_name_changed")).toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to update witness name", async () => {
    mockServer.use(updateWitnessByIdHandlerGenericException);

    const user = userEvent.setup();

    render(
      <EditWitnessNameFormWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows a field error message when failed to update witness name", async () => {
    mockServer.use(updateWitnessByIdHandlerNameFieldException);

    const user = userEvent.setup();

    render(
      <EditWitnessNameFormWithMockToastProvider
        projectId={projectId}
        name={name}
        witness={witness}
      />,
    );

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText(errorField)).toBeInTheDocument();
  });
});
