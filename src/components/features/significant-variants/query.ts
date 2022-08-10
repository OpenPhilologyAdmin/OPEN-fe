import { useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseGetSignificantVariantsForProjectByIdParams = {
  projectId?: number;
};

const getSignificantVariantsForProjectById = (projectId: number) => {
  return apiClient.get<API.GetSignificantVariantsForProjectByIdResponse>(
    `projects/${projectId}/significant_variants`,
  );
};

const queryKeys = {
  getSignificantVariantsForProjectById: (projectId: number) => [
    "projects",
    projectId,
    "significant_variants",
  ],
} as const;

export const useGetSignificantVariantsForProjectById = ({
  projectId,
}: UseGetSignificantVariantsForProjectByIdParams) => {
  const { data, error, isLoading, isError, isFetching, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetSignificantVariantsForProjectByIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getSignificantVariantsForProjectById(projectId || 0),
    () => getSignificantVariantsForProjectById(projectId || 0),
    {
      refetchOnWindowFocus: false,
      enabled: !!projectId,
    },
  );

  return { data: data?.data, error, isError, isLoading, isFetching, isRefetching, refetch };
};

export const useInvalidateGetSignificantVariantsForProjectByIdQuery = () => {
  const queryClient = useQueryClient();

  const invalidateGetSignificantVariantsForProjectById = ({
    projectId,
  }: UseGetSignificantVariantsForProjectByIdParams) => {
    if (projectId) {
      queryClient.invalidateQueries(queryKeys.getSignificantVariantsForProjectById(projectId));
    }
  };

  return { invalidateGetSignificantVariantsForProjectById };
};
