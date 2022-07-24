import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseDeleteProjectByIdOptions = {
  onSuccess: (data: AxiosResponse<API.DeleteProjectByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const deleteProjectById = (payload: API.DeleteProjectByIdPayload) => {
  return apiClient.delete<API.DeleteProjectByIdResponse>(`/projects/${payload.id}`);
};

export const useDeleteProjectById = ({ onSuccess, onError }: UseDeleteProjectByIdOptions) =>
  useMutation(deleteProjectById, { onError, onSuccess });
