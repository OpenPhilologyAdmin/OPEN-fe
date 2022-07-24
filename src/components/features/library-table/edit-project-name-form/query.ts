import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseUpdateProjectByIdOptions = {
  onSuccess: (data: AxiosResponse<API.UpdateProjectByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type UpdateProjectByIdPayload = {
  data: API.UpdateProjectByIdPayload;
  id: number;
};

const updateProjectById = ({ data, id }: UpdateProjectByIdPayload) => {
  return apiClient.put<API.UpdateProjectByIdResponse>(`/projects/${id}`, {
    project: data.project,
  });
};

export const useUpdateProjectById = ({ onSuccess, onError }: UseUpdateProjectByIdOptions) =>
  useMutation(updateProjectById, { onError, onSuccess });
