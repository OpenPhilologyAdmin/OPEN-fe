import { useMutation } from "react-query";
import { ApiError } from "next/dist/server/api-utils";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseNewPasswordOptions = {
  onSuccess: (data: AxiosResponse<API.NewPasswordResponse, any>) => void;
  onError: (error: AxiosError<ApiError>) => void;
};

const newPassword = (user: API.NewPasswordPayload) => {
  return apiClient.put<API.NewPasswordResponse>("users/password", {
    user,
  });
};

export const useNewPassword = ({ onSuccess, onError }: UseNewPasswordOptions) =>
  useMutation(newPassword, { onError, onSuccess });
