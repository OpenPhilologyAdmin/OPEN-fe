import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosResponse } from "axios";

type UseResendActivationEmailOptions = {
  onSuccess: (data: AxiosResponse<API.ResendActivationEmailResponse, any>) => void;
};

const ResendActivationEmail = ({ user }: API.ResendActivationEmailPayload) => {
  return apiClient.post<API.ResendActivationEmailResponse>("users/confirmation", {
    user,
  });
};

export const useResendActivationEmail = ({ onSuccess }: UseResendActivationEmailOptions) =>
  useMutation(ResendActivationEmail, { onSuccess });
