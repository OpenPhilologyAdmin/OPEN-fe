import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";

const registerAccount = ({ user }: API.RegisterAccountPayload) => {
  return apiClient.post<API.RegisterAccountResponse>("/users", {
    user,
  });
};

export const useRegisterAccount = () => useMutation(registerAccount);
