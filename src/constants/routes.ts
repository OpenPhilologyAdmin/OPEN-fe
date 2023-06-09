import { NEW_PASSWORD_TOKEN_KEY } from "./reset-password-token";

export const ROUTES = {
  HOME: () => "/",
  SIGN_IN: () => "/sign-in",
  RESET_PASSWORD: () => "/reset-password",
  NEW_PASSWORD: (newPasswordTokenValue: string) =>
    `/new-password?${NEW_PASSWORD_TOKEN_KEY}=${newPasswordTokenValue}`,
  REGISTER_ACCOUNT: () => "/register-account",
  RESEND_ACTIVATION_EMAIL: () => "/resend-activation-email",
  CONFIRM_ACCOUNT: () => "/confirm-account",
  MANAGE_USERS: () => "/manage-users",
  IMPORT_FILE: () => "/import-file",
  LIBRARY: () => "/library",
  PROJECT: (projectId: number) => `/library/${projectId}`,
  WITNESS_LIST: (projectId: number) => `/library/${projectId}/witness-list`,
};

export type Routes = keyof typeof ROUTES;
