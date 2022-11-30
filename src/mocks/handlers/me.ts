import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getMeEndpoint = `${baseUrl}/users/me`;

const getMeResponse: API.User = {
  id: 0,
  email: "user@example.com",
  name: "string",
  role: "admin",
  registration_date: "2022-07-15",
  account_approved: true,
  last_edited_project_id: null,
};

export const getMe = rest.get(getMeEndpoint, (_, res, ctx) => res(ctx.json(getMeResponse)));
