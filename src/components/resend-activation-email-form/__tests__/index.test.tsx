import {
  resendActivationEmailHandlerException,
  responseError,
  responseSuccess,
} from "@/mocks/handlers/resend-activation-email";
import { mockServer, MockToastProvider, render, screen, userEvent } from "@/utils/test-utils";

import ResendActivationEmailForm, { FIELDS } from "..";

const ResendActivationEmailValidInput = {
  [FIELDS.EMAIL]: "valid@email.com",
};

function ResendActivationEmailFormWithToastProvider() {
  return (
    <>
      <MockToastProvider />
      <ResendActivationEmailForm />
    </>
  );
}

describe("ResendActivationEmailForm", () => {
  it("renders a form and sends confirmation email", async () => {
    const user = userEvent.setup();

    render(<ResendActivationEmailFormWithToastProvider />);

    const emailInput = screen.getByLabelText("resend_activation_email.user_email");
    const submitButton = screen.getByRole("button", {
      name: "resend_activation_email.confirm",
    });

    await user.type(emailInput, ResendActivationEmailValidInput[FIELDS.EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseSuccess.message)).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(resendActivationEmailHandlerException);

    const user = userEvent.setup();

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ResendActivationEmailFormWithToastProvider />);

    const emailInput = screen.getByLabelText("resend_activation_email.user_email");
    const submitButton = screen.getByRole("button", {
      name: "resend_activation_email.confirm",
    });

    await user.type(emailInput, ResendActivationEmailValidInput[FIELDS.EMAIL]);
    await user.click(submitButton);

    expect(await screen.findByText(responseError.error[0])).toBeInTheDocument();
  });
});
