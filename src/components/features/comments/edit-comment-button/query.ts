import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseEditCommentByIdOptions = {
  onSuccess: (data: AxiosResponse<API.EditCommentByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const editCommentById = (payload: API.EditCommentByIdPayload) => {
  return apiClient.put<API.EditCommentByIdResponse>(
    `/projects/${payload.projectId}/tokens/${payload.tokenId}/comments/${payload.commentId}`,
    {
      body: payload.body,
    },
  );
};

export const useEditCommentById = ({ onSuccess, onError }: UseEditCommentByIdOptions) =>
  useMutation(editCommentById, { onError, onSuccess });
