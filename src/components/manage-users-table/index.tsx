import { ComponentPropsWithoutRef } from "react";
import { useQueryClient } from "react-query";
import { useTranslation } from "next-i18next";

import CheckmarkIcon from "@/assets/images/icons/check.svg";
import CrownIcon from "@/assets/images/icons/crown-1.svg";
import Button from "@/components/button";
import { Container, Tbody as BaseTbody, Td, Th, Thead, Tr } from "@/components/table";
import { toast } from "@/components/toast";
import Typography from "@/components/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled, { css } from "styled-components";

import { queryKeys, useApproveUserById, useGetUserList } from "./query";

type ManageUsersTableProps = ComponentPropsWithoutRef<"div">;

type ViewProps = ComponentPropsWithoutRef<"div"> & {
  users: API.User[];
};

type ErrorProps = {
  apiError: API.Error;
};

type ApproveUserProps = {
  user: API.User;
};

const mediumWidth = 172;
const smallWidth = 112;
// compensate other columns
const wideWidth = css`
  width: calc(100% - ${mediumWidth + smallWidth}px);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WideTable = styled(Container)`
  width: 100%;
`;

const WideTh = styled(Th)`
  ${wideWidth}
`;

const WideTd = styled(Td)`
  ${wideWidth}
`;

const MediumTh = styled(Th)`
  width: ${mediumWidth}px;
`;

const SmallTh = styled(Th)`
  width: ${smallWidth}px;
`;

const MediumTd = styled(Td)`
  width: ${mediumWidth}px;
`;

const SmallTd = styled(Td)`
  width: ${smallWidth}px;
`;

const Tbody = styled(BaseTbody)`
  overflow-y: scroll;
  // compensate wrapping UI to be responsive
  max-height: calc(100vh - 230px);
`;

const TableRecordSkeletonLoader = styled.div`
  height: 20px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.actionsDisabled};
`;

const EmailWithCrownWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-column-gap: 16px;
  grid-template-columns: 1fr 24px;
`;

function View({ users, ...props }: ViewProps) {
  const { t } = useTranslation();

  return (
    <Wrapper {...props}>
      <WideTable>
        <Thead>
          <Tr>
            <WideTh align="left">{t("manage_users.user_email_column")}</WideTh>
            <MediumTh>{t("manage_users.user_name_column")}</MediumTh>
            <SmallTh>{t("manage_users.user_active_column")}</SmallTh>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.id}>
              <WideTd align="left" data-testid="row">
                <EmailWithCrownWrapper>
                  {user.email}
                  {user.role === "admin" && <CrownIcon />}
                </EmailWithCrownWrapper>
              </WideTd>
              <MediumTd>{user.name}</MediumTd>
              <SmallTd>
                <ApproveUser user={user} />
              </SmallTd>
            </Tr>
          ))}
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function Loader() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <WideTable>
        <Thead>
          <Tr>
            <WideTh align="left">{t("manage_users.user_email_column")}</WideTh>
            <MediumTh>{t("manage_users.user_name_column")}</MediumTh>
            <SmallTh>{t("manage_users.user_active_column")}</SmallTh>
          </Tr>
        </Thead>
        <Tbody>
          {[...Array(5).keys()].map(count => (
            <Tr key={count}>
              <WideTd align="left">
                <TableRecordSkeletonLoader />
              </WideTd>
              <MediumTd>
                <TableRecordSkeletonLoader />
              </MediumTd>
              <SmallTd>
                <Button isLoading disabled small>
                  {t("manage_users.loading")}
                </Button>
              </SmallTd>
            </Tr>
          ))}
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function Error({ apiError }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <WideTable>
        <Thead>
          <Tr>
            <WideTh align="left">{t("manage_users.user_email_column")}</WideTh>
            <MediumTh>{t("manage_users.user_name_column")}</MediumTh>
            <SmallTh>{t("manage_users.user_active_column")}</SmallTh>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{apiError.error}</Td>
          </Tr>
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function ApproveUser({ user }: ApproveUserProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate: approveUser } = useApproveUserById({
    onSuccess: ({ data: { email } }) => {
      queryClient.invalidateQueries(queryKeys.getUserList());
      toast.success(
        <Typography>{t("manage_users.user_approved_success_message", { email })}</Typography>,
      );
    },
    onError: () => {
      toast.error(<Typography>{t("manage_users.user_approved_error_message")}</Typography>);
    },
  });

  return user.account_approved ? (
    <CheckmarkIcon role="graphics-symbol" />
  ) : (
    <Button small onClick={() => approveUser({ id: user.id })}>
      {t("manage_users.activate")}
    </Button>
  );
}

function ManageUsersTable({ children, ...props }: ManageUsersTableProps) {
  const { data, isLoading, isError, error: axiosError } = useGetUserList();
  const apiError = unwrapAxiosError(axiosError);
  const users = data?.records;

  if (isError && apiError) return <Error apiError={apiError} />;

  if (isLoading && !users) return <Loader />;

  if (users) {
    return <View {...props} users={users} />;
  }

  return null;
}

export default ManageUsersTable;
