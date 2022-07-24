import { errorGeneric, getProjectListHandlerException, message } from "@/mocks/handlers/library";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import LibraryTable from "..";

function LibraryTableWithMockToastProvider() {
  return (
    <>
      <MockToastProvider />
      <LibraryTable />
    </>
  );
}

describe("LibraryTable", () => {
  it("renders correctly and shows generic backend error when the project list is not fetched", async () => {
    mockServer.use(getProjectListHandlerException);

    render(<LibraryTableWithMockToastProvider />);

    expect(await screen.findByText(errorGeneric)).toBeInTheDocument();
  });

  it("renders correctly the number of project records received from the backend", async () => {
    render(<LibraryTableWithMockToastProvider />);

    const rows = await screen.findAllByTestId("row");

    expect(rows.length).toEqual(1);
  });

  it("renders disabled delete button when user id doesn't match creator id", async () => {
    const user = userEvent.setup();

    render(<LibraryTableWithMockToastProvider />, { user: { id: 1111 } });

    const deleteButton = await screen.findByTestId("delete-button");

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.queryByText("library.delete_title")).not.toBeInTheDocument();
  });

  it("renders correctly and updates the project name", async () => {
    const user = userEvent.setup();

    render(<LibraryTableWithMockToastProvider />);

    const editButton = await screen.findByTestId("edit-button");

    await user.click(editButton);

    const input = screen.getByRole("textbox");

    await user.type(input, "name");

    const submitButton = screen.getByTestId("submit-button");

    await user.click(submitButton);

    expect(await screen.findByText("library.project_name_changed")).toBeInTheDocument();
  });

  it("renders correctly and deletes the project when creator id matches user id", async () => {
    const user = userEvent.setup();

    render(<LibraryTableWithMockToastProvider />, {
      user: {
        id: 1,
      },
    });

    const deleteButton = await screen.findByTestId("delete-button");

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "library.delete_confirm" });

    await user.click(confirmButton);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });
});
