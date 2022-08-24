import { rest } from "msw";

export const errorOne = "error1";
export const errorTwo = "error2";
const getUploadedProject = (status: API.ProjectStatus): API.ImportFileResponse => ({
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
  status,
  created_by: "John Doe",
  last_edit_by: "John Doe",
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  creator_id: 0,
  import_errors: {
    random_error_key_one: [errorOne],
    random_error_key_Two: [errorTwo],
  },
});

const getProjectByIdResponse = (status: API.ProjectStatus): API.GetProjectByIdResponse => ({
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
  status,
  created_by: "John Doe",
  last_edit_by: "John Doe",
  creation_date: "2022-06-30T00:00:00.000+02:00",
  last_edit_date: "2022-07-01T00:00:00.000+02:00",
  creator_id: 0,
  import_errors: {
    random_error_key_one: [errorOne],
    random_error_key_Two: [errorTwo],
  },
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getProjectByIdEndpoint = `${baseUrl}/projects/:id`;
const importFileEndpoint = `${baseUrl}/projects`;
export const error = "Internal server error";

export const getProjectByIdHandler = rest.get(getProjectByIdEndpoint, (_, res, ctx) =>
  res(ctx.json(() => getProjectByIdResponse("processing"))),
);

export const getProjectByIdHandlerInvalid = rest.post(importFileEndpoint, (_, res, ctx) =>
  res.once(ctx.json(() => getProjectByIdResponse("invalid"))),
);

export const importFileHandler = rest.post(importFileEndpoint, (_, res, ctx) =>
  res(ctx.json(() => getUploadedProject("processing"))),
);

export const importFileHandlerException = rest.post(importFileEndpoint, (_, res, ctx) =>
  res(ctx.status(400), ctx.json({ error })),
);
