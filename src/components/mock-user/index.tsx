// This is an example component that will be removed after project kick-off
import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/button";

import { useAddMockUser, useGetMockUser } from "./query";

type MockUserProps = ComponentPropsWithoutRef<"div">;

type MockUserCardProps = MockUserProps & {
  mockUserId: number;
};

function MockUserCard({ mockUserId }: MockUserCardProps) {
  const { mockUser, error, loading } = useGetMockUser(mockUserId);

  if (loading) return <div>loading</div>;

  if (error) return <div>{error.message}</div>;

  if (mockUser) {
    return (
      <div>
        <div>{mockUser.name}</div>
        <div>{mockUser.email}</div>
        <div>{mockUser.username}</div>
      </div>
    );
  }

  return null;
}

function MockUser(props: MockUserProps) {
  const { t } = useTranslation();
  const [mockUserId, setMockUserId] = useState(1);
  const addMockUser = useAddMockUser();

  const handleFetchNextMockUser = () => setMockUserId(prevId => prevId + 1);

  return (
    <div {...props}>
      <Button onClick={handleFetchNextMockUser}>{t("fetch_mock_user")}</Button>
      <Button
        onClick={() =>
          addMockUser.mutate({
            username: "JohnDoe123",
            email: "johndoe@mockmail.com",
            name: "John",
          })
        }
      >
        {t("add_mock_user")}
      </Button>
      <MockUserCard mockUserId={mockUserId} />
    </div>
  );
}

export default MockUser;
