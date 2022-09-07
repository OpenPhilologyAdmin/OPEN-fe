import { useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseGetInsignificantVariantsForProjectByIdParams = {
  projectId?: number;
};

const getInsignificantVariantsForProjectById = (projectId: number) => {
  return apiClient.get<API.GetInsignificantVariantsForProjectByIdResponse>(
    `projects/${projectId}/insignificant_variants`,
  );
};

const queryKeys = {
  getInsignificantVariantsForProjectById: (projectId: number) => [
    "projects",
    projectId,
    "insignificant_variants",
  ],
} as const;

export const useGetInsignificantVariantsForProjectById = ({
  projectId,
}: UseGetInsignificantVariantsForProjectByIdParams) => {
  const { data, error, isLoading, isError, isFetching, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetInsignificantVariantsForProjectByIdResponse>,
    AxiosError<API.Error>
  >(
    queryKeys.getInsignificantVariantsForProjectById(projectId || 0),
    () => getInsignificantVariantsForProjectById(projectId || 0),
    {
      refetchOnWindowFocus: false,
      enabled: !!projectId,
    },
  );

  return { data: data?.data, error, isError, isLoading, isFetching, isRefetching, refetch };
};

export const useInvalidateGetInsignificantVariantsForProjectByIdQuery = () => {
  const queryClient = useQueryClient();

  const invalidateGetInsignificantVariantsForProjectById = ({
    projectId,
  }: UseGetInsignificantVariantsForProjectByIdParams) => {
    if (projectId) {
      return queryClient.invalidateQueries(
        queryKeys.getInsignificantVariantsForProjectById(projectId),
      );
    }
  };

  return { invalidateGetInsignificantVariantsForProjectById };
};
