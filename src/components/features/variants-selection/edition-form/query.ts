import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseUpdateVariantsForTokenById = {
  onSuccess: (data: AxiosResponse<API.UpdateVariantsForTokenByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type UpdateVariantsForTokenByIdPayload = {
  data: API.UpdateVariantsForTokenByIdPayload;
  projectId: number;
  tokenId: number;
};

const updateVariantsForTokenById = ({
  projectId,
  tokenId,
  data,
}: UpdateVariantsForTokenByIdPayload) => {
  return apiClient.patch<API.UpdateVariantsForTokenByIdResponse>(
    `projects/${projectId}/tokens/${tokenId}/variants`,
    data,
  );
};

export const useUpdateVariantsForTokenById = ({
  onSuccess,
  onError,
}: UseUpdateVariantsForTokenById) =>
  useMutation(updateVariantsForTokenById, { onError, onSuccess });
