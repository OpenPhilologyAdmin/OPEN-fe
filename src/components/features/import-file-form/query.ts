import { useMutation, useQuery } from "react-query";

import { apiClient } from "@/services/api/client";
import { getProjectById } from "@/services/project";
import { AxiosError, AxiosResponse } from "axios";

type UseImportFileOptions = {
  onSuccess: () => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type UseGetProjectByIdParams = {
  id?: number;
  isPolling: boolean;
  options: {
    onSuccess: (data: AxiosResponse<API.GetProjectByIdResponse, any>) => void;
    onError: (error: AxiosError<API.Error>) => void;
  };
};

const queryKeys = {
  getProjectById: (id?: number) => ["project", id],
} as const;

const importFile = (payload: API.ImportFilePayload) => {
  return apiClient.post<API.ImportFileResponse>("/projects", {
    ...payload,
  });
};

export const useImportFile = ({ onSuccess, onError }: UseImportFileOptions) =>
  useMutation(importFile, { onSuccess, onError });

export const useGetProjectById = ({
  id,
  isPolling,
  options: { onError, onSuccess },
}: UseGetProjectByIdParams) => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.GetProjectByIdResponse>,
    AxiosError<API.Error>
  >(queryKeys.getProjectById(id), () => getProjectById({ id }), {
    enabled: !!id,
    refetchInterval: isPolling ? 3000 : false,
    refetchOnWindowFocus: false,
    onError,
    onSuccess,
  });

  return { data: data?.data, error, isLoading, isError, isSuccess };
};
