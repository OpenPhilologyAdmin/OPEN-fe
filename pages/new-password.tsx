import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NewPasswordForm from "@/components/new-password-form";
import { newPasswordTokenKey } from "@/constants/reset-password-token";
import AuthLayout from "@/layouts/auth";

type NewPasswordProps = {
  newPasswordToken: string;
};

function NewPassword({ newPasswordToken }: NewPasswordProps) {
  return <NewPasswordForm newPasswordToken={newPasswordToken} />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const newPasswordToken = query[newPasswordTokenKey];

  if (!newPasswordToken || Array.isArray(newPasswordToken)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
      newPasswordToken,
    },
  };
};

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default NewPassword;
