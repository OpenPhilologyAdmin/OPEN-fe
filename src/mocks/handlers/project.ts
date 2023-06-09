import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getEditorialRemarksEndpoint = `${baseUrl}/editorial_remarks`;
const getInsignificantVariantsForProjectByIdEndpoint = `${baseUrl}/projects/:id/insignificant_variants`;
const getSignificantVariantsForProjectByIdEndpoint = `${baseUrl}/projects/:id/significant_variants`;
const getTokensForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens`;
const getTokenDetailsForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id`;
const splitTokenForProjectByTokenIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/split`;
const editTokensForProjectByProjectIdEndpoint = `${baseUrl}/projects/:id/tokens/resize`;
const updateGroupedVariantsForTokenByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/grouped_variants`;
const updateVariantsForTokenByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/variants`;
const getCommentsForProjectByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/comments`;
const deleteCommentByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/comments/:id`;
const editCommentByIdEndpoint = `${baseUrl}/projects/:id/tokens/:id/comments/:id`;
const exportProjectByIdEndpoint = `${baseUrl}/projects/:id/export`;

export const errorGeneric = "Generic error";
export const variantValue = { selected_reading: "happy", details: "very happy" };
export const commentsValue = { id: 0, body: "project.add_comment_icon" };
export const tokenValue = "token";
export const errorGroupedVariantsField = "grouped variant field error";
export const errorVariantsField = "variant field error";
export const errorEditorialRemark = "editorial remark field error";
export const errorProject = "project field error";
export const errorToken = "token field error";
export const errorNewVariants = "new variants field error";
export const errorSelectedTokenIds = "new selected token ids error";
export const message = "message";

const significantVariant: API.SignificantVariant = {
  index: 1,
  token_id: 1,
  value: variantValue,
};

const insignificantVariant: API.InsignificantVariant = {
  index: 1,
  token_id: 1,
  value: variantValue,
};

export const token: API.Token = {
  apparatus_index: 1,
  id: 1,
  state: "evaluated_with_single",
  t: tokenValue,
  index: 0,
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

export const variants: API.Variant[] = [
  {
    t: "asd",
    witness: "a",
  },
];

export const editorialRemark: API.EditorialRemark = {
  t: "custom text wow",
  type: "em.",
};

const editorialRemarksMap = {
  Conjecture: "conj.",
  Correction: "corr.",
  Emendation: "em.",
  Standardisation: "st.",
} as const;

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

const comment: API.Comment = {
  id: 0,
  body: "",
  token_id: 0,
  user_id: 0,
  created_at: "",
  created_by: "",
  last_edit_at: "",
};

const getSignificantVariantsForProjectByIdResponse: API.GetSignificantVariantsForProjectByIdResponse =
  {
    records: [significantVariant],
    count: 1,
  };

const getInsignificantVariantsForProjectByIdResponse: API.GetInsignificantVariantsForProjectByIdResponse =
  {
    records: [insignificantVariant],
    count: 1,
  };

const getTokensForProjectByIdResponse: API.GetTokensForProjectByIdResponse = {
  records: [token],
  count: 1,
};

const getGetCommentsForProjectByIdResponse: API.GetCommentsForProjectByIdResponse = [comment];

const deleteCommentByIdResponse: API.DeleteCommentByIdResponse = {
  message,
};

const editCommentByIdResponse: API.EditCommentByIdResponse = {
  message,
};

const getTokenDetailsForProjectByIdSuccessResponse: API.GetTokenDetailsForProjectByIdResponse =
  tokenDetails;

const getEditorialRemarksResponse: API.GetEditorialRemarksResponse = editorialRemarksMap;

const updateGroupedVariantsForTokenByIdSuccessResponse: API.UpdateGroupedVariantsForTokenByIdResponse =
  tokenDetails;

const updateVariantsForTokenByIdSuccessResponse: API.UpdateVariantsForTokenByIdResponse =
  tokenDetails;

const splitTokenForProjectByTokenIdSuccessResponse: API.SplitTokenForProjectByTokenIdResponse = {
  message,
};

const editTokensForProjectByProjectIdSuccessResponse: API.EditTokensByProjectIdResponse = {
  message,
};

const exportProjectByIdHandlerSuccessResponse: API.ExportProjectByIdResponse = new Blob();
const exportProjectByIdHandlerFailureResponse: API.ExportProjectByIdResponse = new Blob([
  JSON.stringify({
    readings_separator: "error",
    selected_reading_separator: "error",
    sigla_separator: "error",
  }),
]);

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

export const updateGroupedVariantsForTokenByIdGroupedVariantsFieldException = rest.patch(
  updateGroupedVariantsForTokenByIdEndpoint,
  (_, res, ctx) =>
    res(ctx.status(400), ctx.json({ grouped_variants: [errorGroupedVariantsField] })),
);

// variants edition
export const getEditorialRemarks = rest.get(getEditorialRemarksEndpoint, (_, res, ctx) =>
  res(ctx.json(getEditorialRemarksResponse)),
);

export const getEditorialRemarksException = rest.get(getEditorialRemarksEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateVariantsForTokenById = rest.patch(
  updateVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.json(updateVariantsForTokenByIdSuccessResponse)),
);

export const updateVariantsForTokenByIdGenericException = rest.patch(
  updateVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateVariantsForTokenByIdVariantsFieldException = rest.patch(
  updateVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ variants: [errorVariantsField] })),
);

export const updateVariantsForTokenByIdEditorialRemarkFieldException = rest.patch(
  updateVariantsForTokenByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ editorial_remark: [errorEditorialRemark] })),
);

// tokens
export const getTokensForProjectById = rest.get(getTokensForProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(getTokensForProjectByIdResponse)),
);

export const getTokensForProjectByIdException = rest.get(
  getTokensForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const splitTokenForProjectByTokenId = rest.patch(
  splitTokenForProjectByTokenIdEndpoint,
  (_, res, ctx) => res(ctx.json(splitTokenForProjectByTokenIdSuccessResponse)),
);

export const splitTokenForProjectByTokenIdException = rest.patch(
  splitTokenForProjectByTokenIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const splitTokenForProjectByTokenIdProjectFieldException = rest.patch(
  splitTokenForProjectByTokenIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ project: [errorProject] })),
);

export const splitTokenForProjectByTokenIdNewVariantsFieldException = rest.patch(
  splitTokenForProjectByTokenIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ new_variants: [errorNewVariants] })),
);

export const splitTokenForProjectByTokenIdTokenFieldException = rest.patch(
  splitTokenForProjectByTokenIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ token: [errorToken] })),
);

export const editTokensForProjectByProjectId = rest.patch(
  editTokensForProjectByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.json(editTokensForProjectByProjectIdSuccessResponse)),
);

export const editTokensForProjectByProjectIdException = rest.patch(
  editTokensForProjectByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const editTokensForProjectByProjectIdProjectFieldException = rest.patch(
  editTokensForProjectByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ project: [errorProject] })),
);

export const editTokensForProjectByProjectIdSelectedTokenIdsFieldException = rest.patch(
  editTokensForProjectByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ selected_token_ids: [errorSelectedTokenIds] })),
);

// comments
export const getCommentsForProjectById = rest.get(
  getCommentsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.json(getGetCommentsForProjectByIdResponse)),
);

export const getCommentsForProjectByIdException = rest.get(
  getCommentsForProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const deleteCommentById = rest.delete(deleteCommentByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(deleteCommentByIdResponse)),
);

export const deleteCommentByIdException = rest.delete(deleteCommentByIdEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const editCommentById = rest.put(editCommentByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(editCommentByIdResponse)),
);

export const editCommentByIdException = rest.put(editCommentByIdEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// export
export const exportProjectByIdEndpointHandler = rest.put(exportProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(exportProjectByIdHandlerSuccessResponse)),
);

export const exportProjectByIdEndpointHandlerGenericException = rest.put(
  exportProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json(exportProjectByIdHandlerFailureResponse)),
);
