import { ReactElement } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ImportFileForm from "@/components/features/import-file-form";
import BaseLayout from "@/layouts/index";
import FormLayout from "@/layouts/shared/with-form";
import { withAuth } from "@/services/auth/with-auth";

function ImportFile() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("import_file.title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ImportFileForm />
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

ImportFile.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <FormLayout>{page}</FormLayout>
    </BaseLayout>
  );
};

export default ImportFile;
