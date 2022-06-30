import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const endpoint = `${baseUrl}/users/password`;
const successMessage = "Account created successfully";
const errors = {
  email: "Something went wrong",
};

export const responseSuccess = {
  message: successMessage,
};

export const responseError = {
  error: [errors.email],
};

export const resetPasswordHandler = rest.post(endpoint, (_, res, ctx) =>
  res(ctx.json(responseSuccess)),
);

export const resetPasswordHandlerException = rest.post(endpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ email: [errors.email] })),
);
