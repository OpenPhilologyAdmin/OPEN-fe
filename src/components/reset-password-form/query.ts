import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";

const resetPassword = ({ user: { email } }: API.ResetPasswordPayload) => {
  return apiClient.post<API.ResetPasswordResponse>("users/password", {
    user: {
      email,
    },
  });
};

export const useResetPassword = () => useMutation(resetPassword);
