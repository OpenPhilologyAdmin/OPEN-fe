import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseSignInOptions = {
  onSuccess: (data: AxiosResponse<API.SignInResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const signIn = ({ user }: API.SignInPayload) => {
  return apiClient.post<API.SignInResponse>("/users/sign_in", {
    user,
  });
};

export const useSignIn = ({ onSuccess, onError }: UseSignInOptions) =>
  useMutation(signIn, { onSuccess, onError });
