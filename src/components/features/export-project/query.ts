import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseExportOptions = {
  onSuccess: (data: AxiosResponse<API.ExportProjectByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type ExportProjectByIdPayload = {
  projectId: number;
  data: API.ExportProjectByIdPayload;
};

const exportProjectById = ({ projectId, data }: ExportProjectByIdPayload) => {
  return apiClient.put<API.ExportProjectByIdResponse>(`projects/${projectId}/export/`, data, {
    responseType: "blob",
  });
};

export const useExportProjectById = ({ onSuccess, onError }: UseExportOptions) =>
  useMutation(exportProjectById, { onError, onSuccess });
