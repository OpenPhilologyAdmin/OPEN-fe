import { useMutation, useQuery } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

// query

type GetTokenEditedInfoByProjectId = {
  projectId?: number;
  tokenIds?: number[] | null;
};

type UseGetTokenEditedInfoByProjectId = {
  projectId?: number;
  tokenIds?: number[] | null;
  enabled: boolean;
};

const queryKeys = {
  getTokenEditedInfoForProjectById: (projectId?: number) => [
    "project",
    projectId,
    "tokens",
    "edited",
  ],
} as const;

export const getTokenEditedInfoForProjectById = ({
  projectId,
  tokenIds,
}: GetTokenEditedInfoByProjectId) => {
  return apiClient.get<API.GetTokenEditedInfoByProjectIdResponse>(
    `/projects/${projectId}/tokens/edited`,
    {
      params: {
        selected_token_ids: tokenIds,
      },
    },
  );
};

export const useGetTokenEditedInfoForProjectById = ({
  projectId,
  tokenIds,
  enabled,
}: UseGetTokenEditedInfoByProjectId) => {
  const { data, error, isLoading, isError, isRefetching, refetch, remove } = useQuery<
    AxiosResponse<API.GetTokenEditedInfoByProjectIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getTokenEditedInfoForProjectById(projectId),
    () => getTokenEditedInfoForProjectById({ projectId, tokenIds }),
    {
      enabled: !!projectId && !!tokenIds && enabled,
      refetchOnWindowFocus: false,
    },
  );

  return { data: data?.data, error, isLoading, isError, remove, isRefetching, refetch };
};

// mutation

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
