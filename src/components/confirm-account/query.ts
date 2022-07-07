import { useMutation } from "react-query";

import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseConfirmAccountOptions = {
  onError: (error: AxiosError<API.Error>) => void;
  onSuccess: (data: AxiosResponse<API.ConfirmAccountResponse, any>) => void;
};

const ConfirmAccount = (payload: API.ConfirmAccountPayload) => {
  return apiClient.get<API.ConfirmAccountResponse>(
    `users/confirmation?${CONFIRM_ACCOUNT_TOKEN_KEY}=${payload.confirmation_token}`,
  );
};

export const useConfirmAccount = ({ onError, onSuccess }: UseConfirmAccountOptions) =>
  useMutation(ConfirmAccount, { onError, onSuccess });
