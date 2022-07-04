import { GetServerSidePropsContext } from "next";

import { COOKIES } from "@/constants/cookies";
import { getAccessToken, removeAccessToken } from "@/utils/auth";
import serverCookie from "cookie";

import { apiClient } from "../api/client";

export const isLoggedInClientSide = () => {
  const isLoggedIn = !!getAccessToken();

  return isLoggedIn;
};

export const isLoggedInServerSide = (context: GetServerSidePropsContext) => {
  if (!context.req.headers.cookie) return false;

  const parsedCookies = serverCookie.parse(context.req.headers.cookie);

  return !!parsedCookies[COOKIES.ACCESS_TOKEN];
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
