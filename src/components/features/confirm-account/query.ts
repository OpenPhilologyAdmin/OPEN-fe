import { useQuery } from "react-query";

import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

const confirmAccount = (payload: API.ConfirmAccountPayload) => {
  return apiClient.get<API.ConfirmAccountResponse>(
    `users/confirmation?${CONFIRM_ACCOUNT_TOKEN_KEY}=${payload.confirmation_token}`,
  );
};

const queryKeys = {
  confirmAccount: () => [CONFIRM_ACCOUNT_TOKEN_KEY],
} as const;

export const useConfirmAccount = (payload: API.ConfirmAccountPayload) => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.ConfirmAccountResponse>,
    AxiosError<API.Error>
  >(queryKeys.confirmAccount(), () => confirmAccount(payload), { retry: false });

  return { data: data?.data, error, isLoading, isError, isSuccess };
};
