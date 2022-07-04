import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NewPasswordForm from "@/components/new-password-form";
import { NEW_PASSWORD_TOKEN_KEY } from "@/constants/reset-password-token";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "@/layouts/auth";
import { isLoggedInServerSide } from "@/services/auth";

type NewPasswordProps = {
  newPasswordToken: string;
};

function NewPassword({ newPasswordToken }: NewPasswordProps) {
  return <NewPasswordForm newPasswordToken={newPasswordToken} />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale, ...context }) => {
  const newPasswordToken = context.query[NEW_PASSWORD_TOKEN_KEY];

  if (!newPasswordToken || Array.isArray(newPasswordToken)) {
    return {
      notFound: true,
    };
  }

  if (isLoggedInServerSide(context)) {
    return {
      redirect: {
        destination: ROUTES.HOME(),
        permanent: false,
      },
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
