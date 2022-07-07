import { confirmAccountHandler } from "./confirm-account";
import { newPasswordHandler } from "./new-password";
import { registerAccountHandler } from "./register-account";
import { resendActivationEmailHandler } from "./resend-activation-email";
import { resetPasswordHandler } from "./reset-password";
import { signInHandler } from "./sign-in";

export const handlers = [
  signInHandler,
  registerAccountHandler,
  resetPasswordHandler,
  newPasswordHandler,
  resendActivationEmailHandler,
  confirmAccountHandler,
];
