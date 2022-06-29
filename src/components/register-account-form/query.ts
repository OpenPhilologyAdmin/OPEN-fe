import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosResponse } from "axios";

type UseRegisterAccountOptions = {
  onSuccess: (data: AxiosResponse<API.RegisterAccountResponse, any>) => void;
};

const registerAccount = ({ user }: API.RegisterAccountPayload) => {
  return apiClient.post<API.RegisterAccountResponse>("/users", {
    user,
  });
};

export const useRegisterAccount = ({ onSuccess }: UseRegisterAccountOptions) =>
  useMutation(registerAccount, { onSuccess });
