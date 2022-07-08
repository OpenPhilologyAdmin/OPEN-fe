import { COOKIES } from "@/constants/cookies";
import clientCookie from "js-cookie";

export const getAccessToken = (): string | undefined => {
  return clientCookie.get(COOKIES.ACCESS_TOKEN);
};

export const setAccessToken = (token: string) => {
  // hours * minutes * seconds * milliseconds
  const COOKIE_EXPIRES_IN_6_HOURS = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);

  clientCookie.set(COOKIES.ACCESS_TOKEN, token, {
    expires: COOKIE_EXPIRES_IN_6_HOURS,
  });
};

export const removeAccessToken = () => {
  clientCookie.remove(COOKIES.ACCESS_TOKEN);
};
