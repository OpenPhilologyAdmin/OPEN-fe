import {
  newPasswordHandlerException,
  responseError,
  responseSuccess,
} from "@/mocks/handlers/new-password";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import NewPasswordForm, { CONFIRM_PASSWORD, PASSWORD } from "..";

const validPassword = "ValidPassword123";
const validPasswordAlternate = "ValidPassword123123";
const newPasswordValidInput = {
  [PASSWORD]: validPassword,
  [CONFIRM_PASSWORD]: validPassword,
};
const tokenKey = "reset_password_token";
const tokenValue = "123123123";

describe("NewPasswordForm", () => {
  it("renders a form and sets a new password", async () => {
    const user = userEvent.setup();

    render(<NewPasswordForm />, { router: { query: { [tokenKey]: tokenValue } } });

    const passwordInput = screen.getByLabelText("new_password.user_password");
    const confirmPasswordInput = screen.getByLabelText("new_password.user_confirm_password");
    const submitButton = screen.getByRole("button", {
      name: "new_password.save_and_sign_in",
    });

    await user.type(passwordInput, newPasswordValidInput[PASSWORD]);
    await user.type(confirmPasswordInput, newPasswordValidInput[CONFIRM_PASSWORD]);
    await user.click(submitButton);

    expect(await screen.findByText(responseSuccess.message)).toBeInTheDocument();
  });

  it("renders a form and displays custom password no match error", async () => {
    const user = userEvent.setup();

    render(<NewPasswordForm />, { router: { query: { [tokenKey]: tokenValue } } });

    const passwordInput = screen.getByLabelText("new_password.user_password");
    const confirmPasswordInput = screen.getByLabelText("new_password.user_confirm_password");
    const submitButton = screen.getByRole("button", {
      name: "new_password.save_and_sign_in",
    });

    await user.type(passwordInput, newPasswordValidInput[PASSWORD]);
    await user.type(confirmPasswordInput, validPasswordAlternate);
    await user.click(submitButton);

    expect(await screen.findByText("new_password.password_no_match")).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(newPasswordHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<NewPasswordForm />, { router: { query: { [tokenKey]: tokenValue } } });

    const passwordInput = screen.getByLabelText("new_password.user_password");
    const confirmPasswordInput = screen.getByLabelText("new_password.user_confirm_password");
    const submitButton = screen.getByRole("button", {
      name: "new_password.save_and_sign_in",
    });

    await user.type(passwordInput, newPasswordValidInput[PASSWORD]);
    await user.type(confirmPasswordInput, newPasswordValidInput[CONFIRM_PASSWORD]);
    await user.click(submitButton);

    expect(await screen.findByText(responseError.error[0])).toBeInTheDocument();
  });
});
