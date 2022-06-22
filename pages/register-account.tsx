import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RegisterAccountForm from "@/components/register-account-form";
import AuthLayout from "@/layouts/auth";

function RegisterAccount() {
  return <RegisterAccountForm />;
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

RegisterAccount.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default RegisterAccount;
