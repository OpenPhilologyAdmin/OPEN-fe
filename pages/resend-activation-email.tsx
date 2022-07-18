import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ResendActivationEmailForm from "@/components/resend-activation-email-form";
import { ROUTES } from "@/constants/routes";
import FormLayout from "@/layouts/base/with-form";
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
  return <FormLayout>{page}</FormLayout>;
};

export default ResendActivationEmail;
