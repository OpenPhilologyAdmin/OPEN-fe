import { rest } from "msw";

const uploadedProject: API.ImportFileResponse = {
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
  status: "processing",
  created_by: "John Doe",
  last_edit_by: "John Doe",
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  creator_id: 0,
};

const getProjectByIdResponse: API.GetProjectByIdResponse = {
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
  last_edit_by: "John Doe",
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  creator_id: 0,
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getProjectByIdEndpoint = `${baseUrl}/projects/:id`;
const importFileEndpoint = `${baseUrl}/projects`;
export const error = "Internal server error";

export const getProjectByIdHandler = rest.get(getProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(getProjectByIdResponse)),
);

// I wasn't able to achieve mocking error handling for the polling project request within the estimated time for the feature

// export const getProjectByIdHandlerException = rest.get(getProjectByIdEndpoint, (_, res, ctx) =>
//   res(ctx.status(400), ctx.json({ error })),
// );

export const importFileHandler = rest.post(importFileEndpoint, (_, res, ctx) =>
  res(ctx.json(uploadedProject)),
);

export const importFileHandlerException = rest.post(importFileEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error })),
);
