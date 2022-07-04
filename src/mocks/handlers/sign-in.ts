import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const endpoint = `${baseUrl}/users/sign_in`;

const mockSignInUser = {
  id: 0,
  email: "user@example.com",
  name: "string",
  role: "admin",
  account_approved: true,
};

export const errors = {
  global: "This is a global error in toast",
};

export const signInHandler = rest.post(endpoint, (_, res, ctx) => {
  return res(ctx.json(mockSignInUser));
});

export const signInHandlerException = rest.post(endpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: errors.global })),
);
