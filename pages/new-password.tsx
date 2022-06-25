import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NewPasswordForm from "@/components/new-password-form";
import { resetPasswordTokenKey } from "@/constants/reset-password-token";
import AuthLayout from "@/layouts/auth";

function NewPassword() {
  return <NewPasswordForm />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  if (!(resetPasswordTokenKey in query)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default NewPassword;
