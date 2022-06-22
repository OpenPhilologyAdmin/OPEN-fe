import {
  resetPasswordHandlerException,
  responseError,
  responseSuccess,
} from "@/mocks/handlers/reset-password";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import ResetPasswordForm, { EMAIL } from "..";

const resetPasswordValidInput = {
  [EMAIL]: "valid@email.com",
};

describe("ResetPasswordForm", () => {
  it("renders a form and sends reset password email", async () => {
    const user = userEvent.setup();

    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText("reset_password.user_email");
    const submitButton = screen.getByRole("button", {
      name: "reset_password.reset_password_button_text",
    });

    await user.type(emailInput, resetPasswordValidInput[EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseSuccess.message)).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(resetPasswordHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText("reset_password.user_email");
    const submitButton = screen.getByRole("button", {
      name: "reset_password.reset_password_button_text",
    });

    await user.type(emailInput, resetPasswordValidInput[EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseError.message[0])).toBeInTheDocument();
  });
});
