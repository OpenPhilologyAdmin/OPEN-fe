import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RegisterAccountForm from "@/components/register-account-form";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "@/layouts/auth";
import { isLoggedInServerSide } from "@/services/auth";

function RegisterAccount() {
  return <RegisterAccountForm />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale, ...context }) => {
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
    },
  };
};

RegisterAccount.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default RegisterAccount;
