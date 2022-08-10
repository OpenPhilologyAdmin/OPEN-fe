import { useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseGetTokensForProjectByIdParams = {
  projectId: number;
};

const getTokensForProjectById = (projectId: number) => {
  return apiClient.get<API.GetTokensForProjectByIdResponse>(`projects/${projectId}/tokens`);
};

const queryKeys = {
  getTokensForProjectById: (projectId: number) => ["projects", projectId, "tokens"],
} as const;

export const useGetTokensForProjectById = ({ projectId }: UseGetTokensForProjectByIdParams) => {
  const { data, error, isLoading, isFetching, isError, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetTokensForProjectByIdResponse>,
    AxiosError<API.Error>
  >(queryKeys.getTokensForProjectById(projectId), () => getTokensForProjectById(projectId), {
    refetchOnWindowFocus: false,
  });

  return { data: data?.data, error, isLoading, isError, isFetching, isRefetching, refetch };
};

export const useInvalidateGetTokensForProjectByIdQuery = () => {
  const queryClient = useQueryClient();

  const invalidateGetTokensForProjectById = ({ projectId }: UseGetTokensForProjectByIdParams) =>
    queryClient.invalidateQueries(queryKeys.getTokensForProjectById(projectId));

  return { invalidateGetTokensForProjectById };
};
