import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const endpoint = `${baseUrl}/users/password`;
const successMessage = "Account created successfully";
const errors = {
  password: "Password error",
};

export const responseSuccess = {
  message: successMessage,
};

export const responseError = {
  error: [errors.password],
};

export const newPasswordHandler = rest.put(endpoint, (_, res, ctx) =>
  res(ctx.json(responseSuccess)),
);

export const newPasswordHandlerException = rest.put(endpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json(responseError)),
);
