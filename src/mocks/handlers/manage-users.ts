import { rest } from "msw";

const approvedUser: API.User = {
  id: 0,
  email: "user@example.com",
  name: "string",
  role: "admin",
  registration_date: "2022-07-15",
  account_approved: true,
};

const getUserListResponse: API.GetUserListResponse = {
  records: [
    {
      id: 0,
      email: "user1@example.com",
      name: "string",
      role: "admin",
      registration_date: "2022-07-15",
      account_approved: false,
    },
    {
      id: 1,
      email: "user2@example.com",
      name: "string",
      role: "admin",
      registration_date: "2022-07-15",
      account_approved: true,
    },
    {
      id: 3,
      email: "user3@example.com",
      name: "string",
      role: "admin",
      registration_date: "2022-07-15",
      account_approved: false,
    },
  ],
  count: 3,
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getListEndpoint = `${baseUrl}/users`;
const approveUserEndpoint = `${baseUrl}/users/:id/approve`;
export const error = "Internal server error";

export const getUsersListHandler = rest.get(getListEndpoint, (_, res, ctx) =>
  res(ctx.json(getUserListResponse)),
);

export const getUsersListHandlerException = rest.get(getListEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error })),
);

export const approveUserByIdHandler = rest.patch(approveUserEndpoint, (_, res, ctx) =>
  res(ctx.json(approvedUser)),
);

export const approveUserByIdHandlerException = rest.patch(approveUserEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error })),
);
