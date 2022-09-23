import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseAddWitnessOptions = {
  onSuccess: (data: AxiosResponse<API.AddWitnessResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const addWitness = ({ projectId, ...data }: API.AddWitnessPayload) => {
  return apiClient.post<API.AddWitnessResponse>(`projects/${projectId}/witnesses/`, {
    projectId,
    ...data,
  });
};

export const useAddWitness = ({ onSuccess, onError }: UseAddWitnessOptions) =>
  useMutation(addWitness, { onError, onSuccess });
