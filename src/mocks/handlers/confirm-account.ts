import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const endpoint = `${baseUrl}/users/confirmation`;
const successMessage = "We've sent you a confirmation email";
const errors = {
  [CONFIRM_ACCOUNT_TOKEN_KEY]: "Wrong message",
};

export const validToken = "123";

export const responseSuccess = {
  message: successMessage,
};

export const responseError = {
  error: [errors[CONFIRM_ACCOUNT_TOKEN_KEY]],
};

export const confirmAccountHandler = rest.get(endpoint, (_, res, ctx) =>
  res(ctx.json(responseSuccess)),
);

export const confirmAccountHandlerException = rest.get(endpoint, (_, res, ctx) =>
  res(
    ctx.status(400),
    ctx.json({ [CONFIRM_ACCOUNT_TOKEN_KEY]: [errors[CONFIRM_ACCOUNT_TOKEN_KEY]] }),
  ),
);
