import { useMutation, useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type GetCommentsForTokenById = {
  projectId: number;
  tokenId: number | null;
};

type UseGetCommentsForTokenById = {
  projectId: number;
  tokenId: number | null;
};

type UseAddCommentOptions = {
  onSuccess: () => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const queryKeys = {
  getCommentsForTokenById: (projectId?: number, tokenId?: number | null) => [
    "projects",
    projectId,
    "tokens",
    tokenId,
  ],
} as const;

export const getCommentsForTokenById = ({ projectId, tokenId }: GetCommentsForTokenById) => {
  return apiClient.get<API.GetCommentsForProjectByIdResponse>(
    `/projects/${projectId}/tokens/${tokenId}/comments`,
  );
};

export const useGetCommentsForTokenById = ({ projectId, tokenId }: UseGetCommentsForTokenById) => {
  const { data, error, isLoading, isError, isFetching, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetCommentsForProjectByIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getCommentsForTokenById(projectId, tokenId),
    () => getCommentsForTokenById({ projectId, tokenId }),
    {
      enabled: !!projectId && !!tokenId,
      refetchOnWindowFocus: false,
    },
  );

  return { data: data?.data, error, isLoading, isError, isFetching, isRefetching, refetch };
};

export const useInvalidateGetCommentsForTokenById = () => {
  const queryClient = useQueryClient();

  const invalidateGetCommentsForTokenById = (projectId: number, tokenId: number | null) => {
    return queryClient.invalidateQueries(queryKeys.getCommentsForTokenById(projectId, tokenId));
  };

  return { invalidateGetCommentsForTokenById };
};

const addComment = ({ projectId, tokenId, body }: API.AddCommentPayload) => {
  return apiClient.post<API.AddCommentResponse>(
    `/projects/${projectId}/tokens/${tokenId}/comments`,
    {
      body,
    },
  );
};

export const useAddComment = ({ onSuccess, onError }: UseAddCommentOptions) =>
  useMutation(addComment, { onSuccess, onError });
