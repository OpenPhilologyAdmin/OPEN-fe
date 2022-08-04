import { apiClient } from "../api/client";

type GetProjectByIdParams = {
  id?: number;
  token?: string;
};

// TODO find a way for server-side request token auto-forward

export const getProjectById = ({ id, token }: GetProjectByIdParams) => {
  return apiClient.get<API.GetProjectByIdResponse>(`/projects/${id}`, {
    ...(token
      ? {
          headers: {
            authorization: token,
          },
        }
      : {}),
  });
};
