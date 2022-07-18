import { confirmAccountHandler } from "./confirm-account";
import { getProjectByIdHandler, importFileHandler } from "./import-file";
import { approveUserByIdHandler, getUsersListHandler } from "./manage-users";
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
  getUsersListHandler,
  approveUserByIdHandler,
  getProjectByIdHandler,
  importFileHandler,
];
