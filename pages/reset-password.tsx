import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ResetPasswordForm from "@/components/features/reset-password-form";
import { ROUTES } from "@/constants/routes";
import BaseLayout from "@/layouts/index";
import FormLayout from "@/layouts/shared/with-form";
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
  return (
    <BaseLayout>
      <FormLayout>{page}</FormLayout>
    </BaseLayout>
  );
};

export default ResetPassword;
