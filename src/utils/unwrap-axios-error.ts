import axios from "axios";

export const unwrapAxiosError = (axiosError: unknown): API.Error | null => {
  if (axios.isAxiosError(axiosError)) {
    return axiosError.response?.data as API.Error;
  }

  return null;
};
