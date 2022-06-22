import {
  errors,
  registerAccountHandlerException,
  registeredUser,
} from "@/mocks/handlers/register-account";
import { mockServer, render, screen, userEvent } from "@/utils/test-utils";

import RegisterAccountForm, { CONFIRM_PASSWORD, EMAIL, NAME, PASSWORD } from "..";

const validPassword = "ValidPassword123";
const validPasswordAlternate = "ValidPassword321";
const registerAccountValidInput = {
  [EMAIL]: registeredUser.email,
  [PASSWORD]: validPassword,
  [CONFIRM_PASSWORD]: validPassword,
  [NAME]: registeredUser.name,
};
const invalidPassword = {
  byLength: "Invalid1",
  byNumber: "InvalidPassword",
};

describe("RegisterAccountForm", () => {
  it("renders a form and creates an account successfully", async () => {
    const user = userEvent.setup();

    render(<RegisterAccountForm />);

    const emailInput = screen.getByLabelText("register_account.user_email");
    const passwordInput = screen.getByLabelText("register_account.user_password");
    const confirmPasswordInput = screen.getByLabelText("register_account.user_confirm_password");
    const nameInput = screen.getByLabelText("register_account.user_name");
    const submitButton = screen.getByRole("button", { name: "register_account.create_account" });

    await user.type(emailInput, registerAccountValidInput[EMAIL]);
    await user.type(passwordInput, registerAccountValidInput[PASSWORD]);
    await user.type(confirmPasswordInput, registerAccountValidInput[CONFIRM_PASSWORD]);
    await user.type(nameInput, registerAccountValidInput[NAME]);
    await user.click(submitButton);

    expect(await screen.findByText("register_account.success_title")).toBeInTheDocument();
    expect(await screen.findByText("register_account.success_description")).toBeInTheDocument();
  });

  it("renders a form and displays custom password length error", async () => {
    const user = userEvent.setup();

    render(<RegisterAccountForm />);

    const emailInput = screen.getByLabelText("register_account.user_email");
    const passwordInput = screen.getByLabelText("register_account.user_password");
    const submitButton = screen.getByRole("button", { name: "register_account.create_account" });

    await user.type(emailInput, registerAccountValidInput[EMAIL]);
    await user.type(passwordInput, invalidPassword.byLength);
    await user.click(submitButton);

    expect(await screen.findByText("register_account.password_invalid_length")).toBeInTheDocument();
  });

  it("renders a form and displays custom password missing number error", async () => {
    const user = userEvent.setup();

    render(<RegisterAccountForm />);

    const emailInput = screen.getByLabelText("register_account.user_email");
    const passwordInput = screen.getByLabelText("register_account.user_password");
    const submitButton = screen.getByRole("button", { name: "register_account.create_account" });

    await user.type(emailInput, registerAccountValidInput[EMAIL]);
    await user.type(passwordInput, invalidPassword.byNumber);
    await user.click(submitButton);

    expect(await screen.findByText("register_account.password_no_number")).toBeInTheDocument();
  });

  it("renders a form and displays custom password no match error", async () => {
    const user = userEvent.setup();

    render(<RegisterAccountForm />);

    const emailInput = screen.getByLabelText("register_account.user_email");
    const passwordInput = screen.getByLabelText("register_account.user_password");
    const confirmPasswordInput = screen.getByLabelText("register_account.user_confirm_password");
    const submitButton = screen.getByRole("button", { name: "register_account.create_account" });

    await user.type(emailInput, registerAccountValidInput[EMAIL]);
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPasswordAlternate);
    await user.click(submitButton);

    expect(await screen.findByText("register_account.password_no_match")).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(registerAccountHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<RegisterAccountForm />);

    const emailInput = screen.getByLabelText("register_account.user_email");
    const passwordInput = screen.getByLabelText("register_account.user_password");
    const confirmPasswordInput = screen.getByLabelText("register_account.user_confirm_password");
    const nameInput = screen.getByLabelText("register_account.user_name");
    const submitButton = screen.getByRole("button", { name: "register_account.create_account" });

    await user.type(emailInput, registerAccountValidInput[EMAIL]);
    await user.type(passwordInput, registerAccountValidInput[PASSWORD]);
    await user.type(confirmPasswordInput, registerAccountValidInput[CONFIRM_PASSWORD]);
    await user.type(nameInput, registerAccountValidInput[NAME]);
    await user.click(submitButton);

    const backendErrorOne = await screen.findByText(errors.email);
    const backendErrorTwo = await screen.findByText(errors.password);

    expect(backendErrorOne).toBeInTheDocument();
    expect(backendErrorTwo).toBeInTheDocument();
  });
});
