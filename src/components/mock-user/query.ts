import { useMutation, useQuery } from "react-query";

import { apiClient } from "@/services/api";

export type MockUser = {
  name: string;
  username: string;
  email: string;
};

type Error = {
  message: string;
};

const addMockUser = (user: MockUser) =>
  apiClient.post<MockUser>("https://jsonplaceholder.typicode.com/users", {
    user,
  });

const getMockUserById = async (userId: number) => {
  const { data } = await apiClient.get(`/users/${userId}`);

  return data;
};

const queryKeys = {
  mockUserDetails: (id: number) => ["mockUser", id],
} as const;

export const useGetMockUser = (id: number) => {
  const {
    data: mockUser,
    error,
    isLoading: loading,
  } = useQuery<MockUser, Error>(queryKeys.mockUserDetails(id), () => getMockUserById(id));

  return { mockUser, error, loading };
};

export const useAddMockUser = () => useMutation(addMockUser);
