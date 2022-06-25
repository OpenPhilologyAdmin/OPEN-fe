import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";

const newPassword = (user: API.NewPasswordPayload) => {
  return apiClient.put<API.NewPasswordResponse>("users/password", {
    user,
  });
};

export const useNewPassword = () => useMutation(newPassword);
