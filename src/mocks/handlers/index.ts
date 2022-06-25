import { newPasswordHandler } from "./new-password";
import { registerAccountHandler } from "./register-account";
import { resetPasswordHandler } from "./reset-password";

export const handlers = [registerAccountHandler, resetPasswordHandler, newPasswordHandler];
