// Example file on how to use MSW
import { rest } from "msw";

export const mockUser = { username: "JohnDoe123", email: "johndoe@mockmail.com", name: "John" };

export const mockErrorMessage = "Request failed with status code 400";

export const mockUserHandler = rest.get(
  "https://jsonplaceholder.typicode.com/users/:id",
  (req, res, ctx) => {
    return res(ctx.json(mockUser));
  },
);

export const mockUserHandlerException = rest.get(
  "https://jsonplaceholder.typicode.com/users/:id",
  async (req, res, ctx) => res(ctx.status(400), ctx.json({ message: mockErrorMessage })),
);
