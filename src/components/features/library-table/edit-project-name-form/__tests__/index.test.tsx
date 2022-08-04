import {
  errorField,
  errorGeneric,
  updateProjectByIdHandlerFieldException,
  updateProjectByIdHandlerGenericException,
} from "@/mocks/handlers/library";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import EditProjectNameForm, { EditProjectNameFormProps } from "..";

const id = 0;
const name = "Name";

function EditProjectNameFormWithMockToastProvider(props: EditProjectNameFormProps) {
  return (
    <>
      <MockToastProvider />
      <EditProjectNameForm {...props} />
    </>
  );
}

describe("EditProjectNameForm", () => {
  it("renders correctly and updates the project name", async () => {
    const user = userEvent.setup();

    render(<EditProjectNameFormWithMockToastProvider id={id} name={name} />);

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText("library.project_name_changed")).toBeInTheDocument();
  });

  it("renders correctly and shows a generic error message when failed to update project name", async () => {
    mockServer.use(updateProjectByIdHandlerGenericException);

    const user = userEvent.setup();

    render(<EditProjectNameFormWithMockToastProvider id={id} name={name} />);

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly and shows a field error message when failed to update project name", async () => {
    mockServer.use(updateProjectByIdHandlerFieldException);

    const user = userEvent.setup();

    render(<EditProjectNameFormWithMockToastProvider id={id} name={name} />);

    const editButton = screen.getByRole("button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, name);

    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    expect(await screen.findByText(errorField)).toBeInTheDocument();
  });
});
