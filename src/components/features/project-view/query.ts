import { useQuery, useQueryClient } from "react-query";

import { Mode } from "@/contexts/current-project-mode";
import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseGetTokensForProjectByIdParams = {
  projectId: number;
  mode: Mode;
};

const getTokensForProjectById = (projectId: number, mode: Mode) => {
  return apiClient.get<API.GetTokensForProjectByIdResponse>(
    `projects/${projectId}/tokens?edit_mode=${mode === "EDIT"}`,
  );
};

const queryKeys = {
  getTokensForProjectById: (projectId: number, mode: Mode) => [
    "projects",
    projectId,
    "tokens",
    mode,
  ],
} as const;

export const useGetTokensForProjectById = ({
  projectId,
  mode,
}: UseGetTokensForProjectByIdParams) => {
  const { data, error, isLoading, isFetching, isError, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetTokensForProjectByIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getTokensForProjectById(projectId, mode),
    () => getTokensForProjectById(projectId, mode),
    {
      refetchOnWindowFocus: false,
    },
  );

  return { data: data?.data, error, isLoading, isError, isFetching, isRefetching, refetch };
};

export const useInvalidateGetTokensForProjectByIdQuery = () => {
  const queryClient = useQueryClient();

  const invalidateGetTokensForProjectById = ({
    projectId,
    mode,
  }: UseGetTokensForProjectByIdParams) =>
    queryClient.invalidateQueries(queryKeys.getTokensForProjectById(projectId, mode));

  return { invalidateGetTokensForProjectById };
};
