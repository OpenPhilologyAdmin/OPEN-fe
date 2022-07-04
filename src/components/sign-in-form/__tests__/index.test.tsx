import { errors, signInHandlerException } from "@/mocks/handlers/sign-in";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import SignInForm, { FIELDS } from "..";

const signInValidInput = {
  [FIELDS.EMAIL]: "valid@email.com",
  [FIELDS.PASSWORD]: "ValidPassword123",
};

const push = jest.fn();

function SignInFormWithToastProvider() {
  return (
    <>
      <MockToastProvider />
      <SignInForm />
    </>
  );
}

describe("SignInForm", () => {
  it("renders a form and signs in successfully", async () => {
    const user = userEvent.setup();

    render(<SignInFormWithToastProvider />, {
      router: {
        push,
      },
    });

    const emailInput = screen.getByLabelText("sign_in.user_email");
    const passwordInput = screen.getByLabelText("sign_in.user_password");
    const submitButton = screen.getByRole("button", {
      name: "sign_in.confirm",
    });

    await user.type(emailInput, signInValidInput[FIELDS.EMAIL]);
    await user.type(passwordInput, signInValidInput[FIELDS.PASSWORD]);
    await user.click(submitButton);

    expect(await screen.findByText("sign_in.success")).toBeInTheDocument();
  });

  it("renders a form and displays backend error in toast", async () => {
    mockServer.use(signInHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<SignInFormWithToastProvider />, {
      router: {
        push,
      },
    });

    const emailInput = screen.getByLabelText("sign_in.user_email");
    const passwordInput = screen.getByLabelText("sign_in.user_password");
    const submitButton = screen.getByRole("button", {
      name: "sign_in.confirm",
    });

    await user.type(emailInput, signInValidInput[FIELDS.EMAIL]);
    await user.type(passwordInput, signInValidInput[FIELDS.PASSWORD]);
    await user.click(submitButton);

    expect(await screen.findByText(errors.global)).toBeInTheDocument();
  });
});
