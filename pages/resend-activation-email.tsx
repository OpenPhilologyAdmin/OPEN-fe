import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ResendActivationEmailForm from "@/components/resend-activation-email-form";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "@/layouts/base/with-auth";
import { withAuth } from "@/services/auth/with-auth";

function ResendActivationEmail() {
  return <ResendActivationEmailForm />;
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

ResendActivationEmail.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResendActivationEmail;
