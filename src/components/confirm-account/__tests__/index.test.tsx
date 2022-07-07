import {
  confirmAccountHandlerException,
  responseError,
  responseSuccess,
  validToken,
} from "@/mocks/handlers/confirm-account";
import { mockServer, MockToastProvider, render, screen } from "@/utils/test-utils";

import ConfirmAccount from "..";

function ConfirmAccountFormWithToastProvider() {
  return (
    <>
      <MockToastProvider />
      <ConfirmAccount confirmAccountToken={validToken} />
    </>
  );
}

describe("ConfirmAccount", () => {
  it("renders a the UI and confirms the account", async () => {
    render(<ConfirmAccountFormWithToastProvider />, {
      router: {
        push: jest.fn(),
      },
    });

    expect(await screen.findByText(responseSuccess.message)).toBeInTheDocument();
  });

  it("renders a form and displays backend error", async () => {
    mockServer.use(confirmAccountHandlerException);

    // * Hides verbose axios error in the test out while mocking error request
    jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

    render(<ConfirmAccountFormWithToastProvider />, {
      router: {
        push: jest.fn(),
      },
    });

    expect(await screen.findByText(responseError.error[0])).toBeInTheDocument();
  });
});
