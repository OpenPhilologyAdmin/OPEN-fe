import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseEditTokensByProjectId = {
  onSuccess: (data: AxiosResponse<API.EditTokensByProjectIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type EditTokensByProjectIdOptions = {
  data: API.EditTokensByProjectIdPayload;
  projectId: number;
};

const editTokensByProjectId = ({ projectId, data }: EditTokensByProjectIdOptions) => {
  return apiClient.patch<API.EditTokensByProjectIdResponse>(
    `projects/${projectId}/tokens/resize`,
    data,
  );
};

export const useEditTokensByProjectId = ({ onSuccess, onError }: UseEditTokensByProjectId) =>
  useMutation(editTokensByProjectId, { onError, onSuccess });
