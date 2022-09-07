import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getInsignificantVariantsForProjectByIdEndpoint = `${baseUrl}/projects/:id/insignificant_variants`;
const getSignificantVariantsForProjectByIdEndpoint = `${baseUrl}/projects/:id/significant_variants`;
const getTokensForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens`;
const getTokenDetailsForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id`;

const updateGroupedVariantsForTokenByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/grouped_variants`;
export const errorGeneric = "Generic error";
export const variantValue = { selected_reading: "happy", details: "very happy" };
export const tokenValue = "token";
export const errorPossibleField = "possible Field error";
export const errorSelectedField = "selected Field error";

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

export const groupedVariants: API.GroupedVariant[] = [
  {
    id: "a",
    possible: false,
    selected: false,
    t: "asd",
    witnesses: ["a"],
  },
  { id: "b", possible: false, selected: true, t: "asd", witnesses: ["b"] },
];

const tokenDetails: API.TokenDetails = {
  apparatus: {
    details: "asd",
    selected_reading: "dsa",
  },
  editorial_remark: {
    t: "",
    type: "conj.",
  },
  grouped_variants: groupedVariants,
  id: 1,
  variants: [{ t: "asd", witness: "a" }],
};

const getSignificantVariantsForProjectByIdResponse: API.GetSignificantVariantsForProjectByIdResponse =
  {
    records: [variant],
    count: 1,
  };

const getInsignificantVariantsForProjectByIdResponse: API.GetInsignificantVariantsForProjectByIdResponse =
  {
    records: [variant],
    count: 1,
  };

const getTokensForProjectByIdResponse: API.GetTokensForProjectByIdResponse = {
  records: [token],
  count: 1,
};

const getTokenDetailsForProjectByIdSuccessResponse: API.GetTokenDetailsForProjectByIdResponse =
  tokenDetails;

const updateGroupedVariantsForTokenByIdSuccessResponse: API.UpdateGroupedVariantsForTokenByIdResponse =
  tokenDetails;

// significant variants
export const getSignificantVariantsForProjectById = rest.get(
  getSignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getSignificantVariantsForProjectByIdResponse)),
);

export const getSignificantVariantsForProjectByIdException = rest.get(
  getSignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// insignificant variants
export const getInsignificantVariantsForProjectById = rest.get(
  getInsignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getInsignificantVariantsForProjectByIdResponse)),
);

export const getInsignificantVariantsForProjectByIdException = rest.get(
  getInsignificantVariantsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// variants selection

export const getTokenDetailsForProjectById = rest.get(
  getTokenDetailsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getTokenDetailsForProjectByIdSuccessResponse)),
);

export const getTokenDetailsForProjectByIdGenericException = rest.get(
  getTokenDetailsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateGroupedVariantsForTokenById = rest.patch(
  updateGroupedVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.json(updateGroupedVariantsForTokenByIdSuccessResponse)),
);

export const updateGroupedVariantsForTokenByIdGenericException = rest.patch(
  updateGroupedVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateGroupedVariantsForTokenByIdSelectedFieldException = rest.patch(
  updateGroupedVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ selected: [errorSelectedField] })),
);

export const updateGroupedVariantsForTokenByIdPossibleFieldException = rest.patch(
  updateGroupedVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ possible: [errorPossibleField] })),
);

// tokens
export const getTokensForProjectById = rest.get(getTokensForProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(getTokensForProjectByIdResponse)),
);

export const getTokensForProjectByIdException = rest.get(
  getTokensForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);
