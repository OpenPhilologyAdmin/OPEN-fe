import { apiClient } from "../api/client";

type GetProjectByIdParams = {
  id?: number;
  token?: string;
};

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
