import { rest } from "msw";

const updateProjectByIdHandlerSuccessResponse: API.UpdateProjectByIdResponse = {
  id: 0,
  name: "string",
  default_witness: "A",
  witnesses: [
    {
      id: "AS",
      name: "Lorem ipsum",
      siglum: "AS",
      default: false,
    },
  ],
  witnesses_count: 0,
  status: "processing",
  created_by: "John Doe",
  creator_id: 1,
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_by: "John Doe",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
};

export const message = "Project deleted";

const deleteProjectByIdHandlerSuccessResponse: API.DeleteProjectByIdResponse = {
  message,
};

const getProjectListSuccessResponse: API.GetProjectListResponse = {
  records: [
    {
      id: 0,
      name: "string",
      default_witness: "A",
      witnesses: [
        {
          id: "A",
          name: "Lorem ipsum",
          siglum: "A",
          default: false,
        },
      ],
      witnesses_count: 0,
      status: "processed",
      created_by: "John Doe",
      creator_id: 1,
      creation_date: "2022-06-30T00:00:00.000+02:00",
      last_edit_by: "John Doe",
      last_edit_date: "2022-07-01T00:00:00.000+02:00",
    },
  ],
  count: 1,
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const updateProjectByIdEndpoint = `${baseUrl}/projects/:id`;
const deleteProjectByIdEndpoint = `${baseUrl}/projects/:id`;
const getProjectListEndpoint = `${baseUrl}/projects`;
export const errorGeneric = "Generic error";
export const errorField = "Name too long.";

// update
export const updateProjectByIdHandler = rest.put(updateProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(updateProjectByIdHandlerSuccessResponse)),
);

export const updateProjectByIdHandlerGenericException = rest.put(
  updateProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

export const updateProjectByIdHandlerFieldException = rest.put(
  updateProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ name: [errorField] })),
);

// delete
export const deleteProjectByIdHandler = rest.delete(deleteProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(deleteProjectByIdHandlerSuccessResponse)),
);

export const deleteProjectByIdHandlerGenericException = rest.delete(
  deleteProjectByIdEndpoint,
  (_, res, ctx) => res(ctx.status(400), ctx.json({ error: errorGeneric })),
);

// get list
export const getProjectListHandler = rest.get(getProjectListEndpoint, (_, res, ctx) =>
  res(ctx.json(getProjectListSuccessResponse)),
);

export const getProjectListHandlerException = rest.get(getProjectListEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error: errorGeneric })),
);
