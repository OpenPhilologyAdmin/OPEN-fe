import { useContext, useEffect } from "react";
import { useQuery } from "react-query";

import { apiClient } from "@/services/api/client";
import { AxiosError, AxiosResponse } from "axios";
import { UserContext } from "src/contexts/user";

const queryKeys = {
  getUser: () => [],
} as const;

const getUser = () => {
  return apiClient.get<API.MeResponse>("/users/me", {});
};

const useGetUser = ({ enabled }: { enabled: boolean }) => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<API.MeResponse>,
    AxiosError<API.Error>
  >(queryKeys.getUser(), getUser, { retry: false, enabled });

  return { data: data?.data, error, isLoading, isError, isSuccess };
};

export const useUser = () => {
  const { user, setUser, isLoggedIn } = useContext(UserContext);
  const { data } = useGetUser({
    enabled: isLoggedIn && !user,
  });

  useEffect(() => {
    if (data && isLoggedIn && !user) {
      setUser(data);
    }
  }, [data, user, setUser, isLoggedIn]);

  return {
    user,
    setUser,
    isLoggedIn,
    isApproved: !!user?.account_approved,
    isAdmin: !!(user?.role === "admin"),
  };
};
