import axios from "axios";

export const unwrapAxiosError = (axiosError: unknown): API.ApiError | null => {
  if (axios.isAxiosError(axiosError)) {
    return axiosError.response?.data as API.ApiError;
  }

  return null;
};
