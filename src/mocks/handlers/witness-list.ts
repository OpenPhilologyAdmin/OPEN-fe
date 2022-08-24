import { rest } from "msw";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getWitnessListByProjectIdEndpoint = `${baseUrl}/projects/:id/witnesses`;
const updateWitnessByIdEndpoint = `${baseUrl}/projects/:id/witnesses/:id`;
const deleteWitnessByIdEndpoint = `${baseUrl}/projects/:id/witnesses/:id`;
export const message = "Project deleted";
export const errorGeneric = "Generic error";
export const errorField = "Name too long.";

export const witness: API.Witness = {
  id: "AS",
  name: "Lorem ipsum",
  siglum: "AS",
  default: false,
};

export const witnessTwo: API.Witness = {
  id: "AB",
  name: "Lorem ipsum",
  siglum: "AB",
  default: true,
};

export const project: API.Project = {
  id: 0,
  name: "string",
  default_witness: "AS",
  witnesses: [witness],
  witnesses_count: 0,
  status: "processing",
  created_by: "John Doe",
  creator_id: 1,
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_by: "John Doe",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  import_errors: {},
};

const deleteWitnessByIdEndpointHandlerSuccessResponse: API.DeleteWitnessByIdResponse = {
  message,
};

const updateWitnessByIdHandlerSuccessResponse: API.UpdateWitnessByIdResponse = {
  witness: { ...witness, default: true },
};

const getWitnessListByProjectIdSuccessResponseWithMoreRecords: API.GetWitnessListByProjectIdResponse =
  {
    records: [witness, witnessTwo],
    count: 2,
  };

// get list
export const getWitnessListByProjectId = rest.get(
  getWitnessListByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.json(getWitnessListByProjectIdSuccessResponseWithMoreRecords)),
);

export const getWitnessListByProjectIdException = rest.get(
  getWitnessListByProjectIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// update
export const updateWitnessByIdHandler = rest.put(updateWitnessByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(updateWitnessByIdHandlerSuccessResponse)),
);

export const updateWitnessByIdHandlerGenericException = rest.put(
  updateWitnessByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateWitnessByIdHandlerNameFieldException = rest.put(
  updateWitnessByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ name: [errorField] })),
);

export const updateWitnessByIdHandlerDefaultFieldException = rest.put(
  updateWitnessByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ default: [errorField] })),
);

// delete
export const deleteWitnessByIdEndpointHandler = rest.delete(
  deleteWitnessByIdEndpoint,
  (_, res, ctx) => res(ctx.json(deleteWitnessByIdEndpointHandlerSuccessResponse)),
);

export const deleteWitnessByIdEndpointHandlerGenericException = rest.delete(
  deleteWitnessByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);
