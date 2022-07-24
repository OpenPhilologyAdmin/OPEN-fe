import { useMutation, useQuery } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseApproveUserById = {
  onSuccess: (data: AxiosResponse<API.ApproveUserByIdResponse, any>) => void;
  onError: () => void;
};

const getUserList = () => {
  return apiClient.get<API.GetUserListResponse>("users");
};

export const queryKeys = {
  getUserList: () => ["users"],
} as const;

export const useGetUserList = () => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.GetUserListResponse>,
    AxiosError<API.Error>
  >(queryKeys.getUserList(), getUserList);

  return { data: data?.data, error, isLoading, isError, isSuccess };
};

const approveUserById = (payload: API.ApproveUserByIdPayload) => {
  return apiClient.patch<API.ApproveUserByIdResponse>(`users/${payload.id}/approve`);
};

export const useApproveUserById = ({ onSuccess, onError }: UseApproveUserById) =>
  useMutation(approveUserById, { onError, onSuccess });
