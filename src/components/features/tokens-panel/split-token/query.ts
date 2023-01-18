import { useMutation, useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

// query

type GetTokenDetailsForProjectById = {
  projectId?: number;
  tokenId?: number | null;
};

type UseGetTokenDetailsForProjectById = {
  projectId?: number;
  tokenId?: number | null;
};

const queryKeys = {
  getTokenDetailsForProjectById: (projectId?: number, tokenId?: number | null) => [
    "project",
    projectId,
    "tokens",
    tokenId,
  ],
} as const;

export const getTokenDetailsForProjectById = ({
  projectId,
  tokenId,
}: GetTokenDetailsForProjectById) => {
  return apiClient.get<API.GetTokenDetailsForProjectByIdResponse>(
    `/projects/${projectId}/tokens/${tokenId}-split`,
  );
};

export const useGetTokenDetailsForProjectById = ({
  projectId,
  tokenId,
}: UseGetTokenDetailsForProjectById) => {
  const { data, error, isLoading, isError, isFetching, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetTokenDetailsForProjectByIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getTokenDetailsForProjectById(projectId, tokenId),
    () => getTokenDetailsForProjectById({ projectId, tokenId }),
    {
      enabled: !!projectId && !!tokenId,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    },
  );

  return { data: data?.data, error, isLoading, isError, isFetching, isRefetching, refetch };
};

export const useInvalidateGetTokenDetailsForProjectById = () => {
  const queryClient = useQueryClient();

  const invalidateGetTokenDetailsForProjectById = (projectId: number, tokenId: number) => {
    return queryClient.invalidateQueries(
      queryKeys.getTokenDetailsForProjectById(projectId, tokenId),
    );
  };

  return { invalidateGetTokenDetailsForProjectById };
};

// mutation

type UseSplitTokenForProjectByTokenId = {
  onSuccess: (data: AxiosResponse<API.SplitTokenForProjectByTokenIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type SplitTokenForProjectByTokenIdPayload = {
  data: API.SplitTokenForProjectByTokenIdPayload;
  projectId: number;
  tokenId: number;
};

const splitTokenForProjectByTokenId = ({
  projectId,
  tokenId,
  data,
}: SplitTokenForProjectByTokenIdPayload) => {
  return apiClient.patch<API.SplitTokenForProjectByTokenIdResponse>(
    `projects/${projectId}/tokens/${tokenId}/split`,
    data,
  );
};

export const useSplitTokenForProjectByTokenId = ({
  onSuccess,
  onError,
}: UseSplitTokenForProjectByTokenId) =>
  useMutation(splitTokenForProjectByTokenId, { onError, onSuccess });
