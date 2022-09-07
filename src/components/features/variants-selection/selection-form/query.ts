import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseUpdateGroupedVariantsForTokenById = {
  onSuccess: (data: AxiosResponse<API.UpdateGroupedVariantsForTokenByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

type UpdateGroupedVariantsForTokenByIdPayload = {
  data: API.UpdateGroupedVariantsForTokenByIdPayload;
  projectId: number;
  tokenId: number;
};

const updateGroupedVariantsForTokenById = ({
  projectId,
  tokenId,
  data,
}: UpdateGroupedVariantsForTokenByIdPayload) => {
  return apiClient.patch<API.UpdateGroupedVariantsForTokenByIdResponse>(
    `projects/${projectId}/tokens/${tokenId}/grouped_variants`,
    data,
  );
};

export const useUpdateGroupedVariantsForTokenById = ({
  onSuccess,
  onError,
}: UseUpdateGroupedVariantsForTokenById) =>
  useMutation(updateGroupedVariantsForTokenById, { onError, onSuccess });
