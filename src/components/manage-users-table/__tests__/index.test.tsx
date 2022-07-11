import {
  approveUserByIdHandlerException,
  error,
  getUsersListHandlerException,
} from "@/mocks/handlers/manage-users";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import ManageUsersTable from "..";

function ManageUsersTableWithMockToastProvider() {
  return (
    <>
      <MockToastProvider />
      <ManageUsersTable />
    </>
  );
}

describe("ManageUsersTable", () => {
  it("renders correctly the number of user records received from the backend", async () => {
    render(<ManageUsersTableWithMockToastProvider />);

    const rows = await screen.findAllByTestId("row");

    expect(rows.length).toEqual(3);
  });

  it("allows to activate user account", async () => {
    const user = userEvent.setup();

    render(<ManageUsersTableWithMockToastProvider />);

    const firstActivateButton = screen.getAllByRole("button", {
      name: "manage_users.activate",
    })[0];

    await user.click(firstActivateButton);

    expect(
      await screen.findByText("manage_users.user_approved_success_message"),
    ).toBeInTheDocument();
  });

  it("renders an error message when failed to activate a user", async () => {
    mockServer.use(approveUserByIdHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ManageUsersTableWithMockToastProvider />);

    const firstActivateButton = screen.getAllByRole("button", {
      name: "manage_users.activate",
    })[0];

    await user.click(firstActivateButton);

    expect(await screen.findByText("manage_users.user_approved_error_message")).toBeInTheDocument();
  });

  it("renders an error message when failed to get a user list from the backend", async () => {
    mockServer.use(getUsersListHandlerException);

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ManageUsersTableWithMockToastProvider />);

    expect(await screen.findByText(error));
  });
});
