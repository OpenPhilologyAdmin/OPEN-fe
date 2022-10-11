import { useMutation } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";

type UseDeleteCommentByIdOptions = {
  onSuccess: (data: AxiosResponse<API.DeleteCommentByIdResponse, any>) => void;
  onError: (error: AxiosError<API.Error>) => void;
};

const deleteCommentById = (payload: API.DeleteCommentByIdPayload) => {
  return apiClient.delete<API.DeleteCommentByIdResponse>(
    `/projects/${payload.projectId}/tokens/${payload.tokenId}/comments/${payload.commentId}`,
  );
};

export const useDeleteCommentById = ({ onSuccess, onError }: UseDeleteCommentByIdOptions) =>
  useMutation(deleteCommentById, { onError, onSuccess });
