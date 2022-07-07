import { GetServerSidePropsContext } from "next";

import { COOKIES } from "@/constants/cookies";
import { getAccessToken, removeAccessToken } from "@/utils/auth";
import serverCookie from "cookie";

import { apiClient } from "../api/client";

export const isLoggedInClientSide = () => {
  const isLoggedIn = !!getAccessToken();

  return isLoggedIn;
};

export const getServerSideAuthToken = (context: GetServerSidePropsContext): string | null => {
  if (!context.req.headers.cookie) return null;

  const parsedCookies = serverCookie.parse(context.req.headers.cookie);

  return parsedCookies[COOKIES.ACCESS_TOKEN];
};

export const hasCookieServerSide = (context: GetServerSidePropsContext) => {
  if (!context.req.headers.cookie) return false;

  return !!getServerSideAuthToken(context);
};

export const signIn = ({ user }: API.SignInPayload) => {
  return apiClient.post<API.SignInResponse>("/users/sign_in", {
    user,
  });
};

export const signOut = () => {
  removeAccessToken();

  return apiClient.delete<API.SignOutResponse>("/users/sign_out");
};

export const refreshToken = () => {
  return apiClient.post<API.RefreshTokenResponse>("/users/session-token");
};

export const getLoggedInUser = (auth: string) => {
  return apiClient.get<API.MeResponse>("/users/me", {
    headers: {
      authorization: auth,
    },
  });
};
