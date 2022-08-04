import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import RegisterAccountForm from "@/components/features/register-account-form";
import { ROUTES } from "@/constants/routes";
import BaseLayout from "@/layouts/index";
import FormLayout from "@/layouts/shared/with-form";
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
  return (
    <BaseLayout>
      <FormLayout>{page}</FormLayout>
    </BaseLayout>
  );
};

export default RegisterAccount;
