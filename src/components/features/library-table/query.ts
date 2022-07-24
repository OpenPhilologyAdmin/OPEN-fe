import { useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

const getProjectList = () => {
  return apiClient.get<API.GetProjectListResponse>("projects");
};

export const queryKeys = {
  getProjectList: () => ["projects"],
} as const;

export const useGetProjectList = () => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.GetProjectListResponse>,
    AxiosError<API.Error>
  >(queryKeys.getProjectList(), getProjectList);

  return { data: data?.data, error, isLoading, isError, isSuccess };
};

export const useInvalidateProjectListQuery = () => {
  const queryClient = useQueryClient();

  const invalidateProjectListQuery = () =>
    queryClient.invalidateQueries(queryKeys.getProjectList());

  return { invalidateProjectListQuery };
};
