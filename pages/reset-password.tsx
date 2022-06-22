import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ResetPasswordForm from "@/components/reset-password-form";
import AuthLayout from "@/layouts/auth";

function ResetPassword() {
  return <ResetPasswordForm />;
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
