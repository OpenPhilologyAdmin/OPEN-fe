import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseDeleteWitnessByIdOptions = {
  onSuccess: (data: AxiosResponse<API.DeleteWitnessByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const deleteWitnessById = ({ projectId, witnessId }: API.DeleteWitnessByIdPayload) => {
  return apiClient.delete<API.DeleteWitnessByIdResponse>(
    `projects/${projectId}/witnesses/${witnessId}`,
  );
};

export const useDeleteWitnessById = ({ onSuccess, onError }: UseDeleteWitnessByIdOptions) =>
  useMutation(deleteWitnessById, { onError, onSuccess });
