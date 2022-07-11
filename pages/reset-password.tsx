import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ResetPasswordForm from "@/components/reset-password-form";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "@/layouts/base/with-auth";
import { withAuth } from "@/services/auth/with-auth";

function ResetPassword() {
  return <ResetPasswordForm />;
}

export const getServerSideProps = withAuth(
  async ({ locale }, user) => {
    if (user) {
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
  },
  { protectedPage: false },
);

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
