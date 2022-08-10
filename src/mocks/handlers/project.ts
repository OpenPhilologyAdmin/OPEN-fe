import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getSignificantVariantsForProjectByIdEndpoint = `${baseUrl}/projects/:id/significant_variants`;
const getGetTokensForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens`;
export const errorGeneric = "Generic error";
export const variantValue = "happy";
export const tokenValue = "token";

const variant: API.SignificantVariant = {
  index: 1,
  token_id: 1,
  value: variantValue,
};

const token: API.Token = {
  apparatus_index: 1,
  id: 1,
  state: "evaluated_with_single",
  t: tokenValue,
};

const getSignificantVariantsForProjectByIdResponse: API.GetSignificantVariantsForProjectByIdResponse =
  {
    records: [variant],
    count: 1,
  };

const getGetTokensForProjectByIdResponse: API.GetTokensForProjectByIdResponse = {
  records: [token],
  count: 1,
};

// significant variants
export const getSignificantVariantsForProjectById = rest.get(
  getSignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getSignificantVariantsForProjectByIdResponse)),
);

export const getSignificantVariantsForProjectByIdException = rest.get(
  getSignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// tokens
export const getGetTokensForProjectById = rest.get(
  getGetTokensForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getGetTokensForProjectByIdResponse)),
);

export const getGetTokensForProjectByIdException = rest.get(
  getGetTokensForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);
