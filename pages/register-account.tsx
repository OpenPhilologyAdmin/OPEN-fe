import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RegisterAccountForm from "@/components/features/register-account-form";
import { ROUTES } from "@/constants/routes";
import FormLayout from "@/layouts/base/with-form";
import { withAuth } from "@/services/auth/with-auth";

function RegisterAccount() {
  return <RegisterAccountForm />;
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

RegisterAccount.getLayout = function getLayout(page: ReactElement) {
  return <FormLayout>{page}</FormLayout>;
};

export default RegisterAccount;
