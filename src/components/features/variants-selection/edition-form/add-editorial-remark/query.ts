import { useQuery } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

const queryKeys = {
  getEditorialRemarks: () => ["editorial_remarks"],
} as const;

export const getEditorialRemarks = () => {
  return apiClient.get<API.GetEditorialRemarksResponse>("editorial_remarks");
};

export const useGetEditorialRemarks = () => {
  const { data, error, isLoading, isError, isFetching, isRefetching, refetch } = useQuery<
    AxiosResponse<API.GetEditorialRemarksResponse>,
    AxiosError<API.Error>
  >(queryKeys.getEditorialRemarks(), () => getEditorialRemarks(), {});

  return { data: data?.data, error, isLoading, isError, isFetching, isRefetching, refetch };
};
