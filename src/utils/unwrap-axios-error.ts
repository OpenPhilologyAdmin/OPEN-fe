import { AxiosError } from "axios";

export const unwrapAxiosError = (axiosError: unknown): API.ApiError => {
  if (axiosError instanceof AxiosError) {
    return axiosError.response?.data as API.ApiError;
  }

  return {
    message: [],
  };
};
