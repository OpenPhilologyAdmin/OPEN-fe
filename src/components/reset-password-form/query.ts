import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosResponse } from "axios";

type UseResetPasswordOptions = {
  onSuccess: (data: AxiosResponse<API.ResetPasswordResponse, any>) => void;
};

const resetPassword = ({ user }: API.ResetPasswordPayload) => {
  return apiClient.post<API.ResetPasswordResponse>("users/password", {
    user,
  });
};

export const useResetPassword = ({ onSuccess }: UseResetPasswordOptions) =>
  useMutation(resetPassword, { onSuccess });
