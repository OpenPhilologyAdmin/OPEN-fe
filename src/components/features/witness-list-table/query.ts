import { useMutation, useQuery, useQueryClient } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseGetWitnessListByProjectIdParams = {
  projectId: number;
};

type UseUpdateWitnessByIdOptions = {
  onSuccess: (data: AxiosResponse<API.UpdateWitnessByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type UpdateWitnessByIdPayload = {
  data: API.UpdateWitnessByIdPayload;
  projectId: number;
  witnessId: string;
};

const getWitnessListByProjectId = (projectId: number) => {
  return apiClient.get<API.GetWitnessListByProjectIdResponse>(`projects/${projectId}/witnesses`);
};

const queryKeys = {
  getWitnessListByProjectId: (projectId: number) => ["projects", projectId, "witnesses"],
} as const;

export const useGetWitnessListByProjectId = ({ projectId }: UseGetWitnessListByProjectIdParams) => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.GetWitnessListByProjectIdResponse>,
    AxiosError<API.Error>
  >(queryKeys.getWitnessListByProjectId(projectId), () => getWitnessListByProjectId(projectId));

  return { data: data?.data, error, isLoading, isError, isSuccess };
};

export const useInvalidateGetWitnessListByProjectId = () => {
  const queryClient = useQueryClient();

  const invalidateGetWitnessListByProjectId = ({ projectId }: UseGetWitnessListByProjectIdParams) =>
    queryClient.invalidateQueries(queryKeys.getWitnessListByProjectId(projectId));

  return { invalidateGetWitnessListByProjectId };
};

const updateWitnessByProjectId = ({ data, projectId, witnessId }: UpdateWitnessByIdPayload) => {
  return apiClient.put<API.UpdateWitnessByIdResponse>(
    `/projects/${projectId}/witnesses/${witnessId}`,
    data,
  );
};

export const useUpdateWitnessById = ({ onSuccess, onError }: UseUpdateWitnessByIdOptions) =>
  useMutation(updateWitnessByProjectId, { onError, onSuccess });
