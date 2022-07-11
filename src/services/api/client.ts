import { QueryClient } from "react-query";

import { HOUR_IN_MILLISECONDS } from "@/constants/hour";
import { getAccessToken, setAccessToken } from "@/utils/auth";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { refreshToken } from "../auth";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.defaults.headers.common["Content-Type"] = "application/json";
apiClient.defaults.headers.common["Accept"] = "application/json";

// Response interceptor for API calls
// TODO verify if it works while implementing new endpoint
// TODO pass current exp when setting token
apiClient.interceptors.request.use(async config => {
  const token = getAccessToken();

  if (token && typeof token === "string" && config.headers) {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp) {
      const expAsDate = new Date().setUTCSeconds(decoded.exp) - new Date().getTime();
      const timeRemaining = expAsDate - new Date().getTime();

      if (timeRemaining < HOUR_IN_MILLISECONDS && config.url !== "/users/session-token") {
        const refreshTokenRequest = await refreshToken();
        const newToken = refreshTokenRequest.headers.authorization;

        config.headers.authorization = `Bearer ${newToken}`;
        setAccessToken(newToken);

        return config;
      }
    }
  }

  if (config.headers && token && typeof token === "string") {
    config.headers.authorization = token;
  }

  return config;
});

// Response interceptor for API calls
apiClient.interceptors.response.use(async response => {
  const token = response.headers.authorization;

  if (token) {
    setAccessToken(token);
  }

  return response;
});

export const queryClient = new QueryClient();
