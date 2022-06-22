import axios from "axios";

export const unwrapAxiosError = (axiosError: unknown): API.ApiError => {
  if (axios.isAxiosError(axiosError)) {
    return axiosError.response?.data as API.ApiError;
  }

  return {
    message: [],
  };
};
