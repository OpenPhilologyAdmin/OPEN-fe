import { ReactElement, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ManageUsersTable from "@/components/features/manage-users-table";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import BaseLayout from "@/layouts/index";
import WithTableLayout from "@/layouts/shared/with-table";
import { withAuth } from "@/services/auth/with-auth";

function ManageUsers() {
  const { t } = useTranslation();
  const { isAdmin } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      push(ROUTES.HOME());
    }
  }, [push, isAdmin]);

  return (
    <>
      <Head>
        <title>{t("manage_users.title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManageUsersTable />
    </>
  );
}

export const getServerSideProps = withAuth(
  async ({ locale }, user) => {
    return {
      props: {
        ...(await serverSideTranslations(locale as string, ["common"])),
        user,
      },
    };
  },
  { protectedPage: true },
);

ManageUsers.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout align="TOP">
      <WithTableLayout>{page}</WithTableLayout>
    </BaseLayout>
  );
};

export default ManageUsers;
