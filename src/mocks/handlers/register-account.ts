import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const endpoint = `${baseUrl}/users`;

export const registeredUser = {
  id: 0,
  email: "user@example.com",
  name: "string",
  role: "admin",
  account_approved: true,
};

export const errors = {
  email: "Email error",
  password: "Password error",
};

export const registerAccountHandler = rest.post(endpoint, (_, res, ctx) => {
  return res(ctx.json(registeredUser));
});

export const registerAccountHandlerException = rest.post(endpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: [errors.email, errors.password] })),
);
