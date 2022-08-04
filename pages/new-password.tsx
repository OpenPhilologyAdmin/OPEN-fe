import { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NewPasswordForm from "@/components/features/new-password-form";
import { NEW_PASSWORD_TOKEN_KEY } from "@/constants/reset-password-token";
import { ROUTES } from "@/constants/routes";
import BaseLayout from "@/layouts/index";
import FormLayout from "@/layouts/shared/with-form";
import { withAuth } from "@/services/auth/with-auth";

type NewPasswordProps = {
  newPasswordToken: string;
};

function NewPassword({ newPasswordToken }: NewPasswordProps) {
  return <NewPasswordForm newPasswordToken={newPasswordToken} />;
}

export const getServerSideProps = withAuth(
  async ({ locale, ...context }, user) => {
    const newPasswordToken = context.query[NEW_PASSWORD_TOKEN_KEY];

    if (!newPasswordToken || Array.isArray(newPasswordToken)) {
      return {
        notFound: true,
      };
    }

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
        newPasswordToken,
      },
    };
  },
  { protectedPage: false },
);

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      <FormLayout>{page}</FormLayout>
    </BaseLayout>
  );
};

export default NewPassword;
