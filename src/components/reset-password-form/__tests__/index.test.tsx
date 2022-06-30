import {
  resetPasswordHandlerException,
  responseError,
  responseSuccess,
} from "@/mocks/handlers/reset-password";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import ResetPasswordForm, { FIELDS } from "..";

const resetPasswordValidInput = {
  [FIELDS.EMAIL]: "valid@email.com",
};

function ResetPasswordFormWithToastProvider() {
  return (
    <>
      <MockToastProvider />
      <ResetPasswordForm />
    </>
  );
}

describe("ResetPasswordForm", () => {
  it("renders a form and sends reset password email", async () => {
    const user = userEvent.setup();

    render(<ResetPasswordFormWithToastProvider />);

    const emailInput = screen.getByLabelText("reset_password.user_email");
    const submitButton = screen.getByRole("button", {
      name: "reset_password.reset_password_button_text",
    });

    await user.type(emailInput, resetPasswordValidInput[FIELDS.EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseSuccess.message)).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(resetPasswordHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ResetPasswordFormWithToastProvider />);

    const emailInput = screen.getByLabelText("reset_password.user_email");
    const submitButton = screen.getByRole("button", {
      name: "reset_password.reset_password_button_text",
    });

    await user.type(emailInput, resetPasswordValidInput[FIELDS.EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseError.error[0])).toBeInTheDocument();
  });
});
