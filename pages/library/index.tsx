import { ReactElement } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import LibraryTable from "@/components/features/library-table";
import BaseLayout from "@/layouts/index";
import WithTableLayout from "@/layouts/shared/with-table";
import { withAuth } from "@/services/auth/with-auth";

function Library() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("library.title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LibraryTable />
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

Library.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout align="TOP">
      <WithTableLayout>{page}</WithTableLayout>
    </BaseLayout>
  );
};

export default Library;
