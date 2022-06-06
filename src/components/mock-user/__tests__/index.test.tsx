import { mockErrorMessage, mockUser, mockUserHandlerException } from "@/mocks/handlers/mockUser";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import MockUser from "..";

describe("MockUser", () => {
  it("renders mock user details on button click", async () => {
    const user = userEvent.setup();

    render(<MockUser />);

    const mockUserButton = await screen.findByRole("button", { name: "fetch_mock_user" });

    await user.click(mockUserButton);

    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
    expect(await screen.findByText(mockUser.name)).toBeInTheDocument();
    expect(await screen.findByText(mockUser.username)).toBeInTheDocument();
  });

  it("displays error message when fetching tasks raises error", async () => {
    mockServer.use(mockUserHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<MockUser />);

    const mockUserButton = await screen.findByRole("button", { name: "fetch_mock_user" });

    await user.click(mockUserButton);

    const errorDisplay = await screen.findByText(mockErrorMessage);

    expect(errorDisplay).toBeInTheDocument();
  });
});
