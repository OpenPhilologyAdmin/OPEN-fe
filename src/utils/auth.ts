import { COOKIES } from "@/constants/cookies";
import clientCookie from "js-cookie";

export const getAccessToken = (): string | undefined => {
  return clientCookie.get(COOKIES.ACCESS_TOKEN);
};

export const setAccessToken = (token: string) => {
  clientCookie.set(COOKIES.ACCESS_TOKEN, token);
};

export const removeAccessToken = () => {
  clientCookie.remove(COOKIES.ACCESS_TOKEN);
};
