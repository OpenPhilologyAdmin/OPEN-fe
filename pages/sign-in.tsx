import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Button from "@/components/button";
import SignInForm from "@/components/sign-in-form";
import { ROUTES } from "@/constants/routes";
import FormLayout from "@/layouts/base/with-form";
import { withAuth } from "@/services/auth/with-auth";
import styled from "styled-components";

const LinksWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-top: 12px;
`;

function SignIn() {
  const { t } = useTranslation();

  return (
    <>
      <SignInForm />
      <LinksWrapper>
        <Button href={ROUTES.RESET_PASSWORD()} variant="tertiary">
          {t("sign_in.reset_password")}
        </Button>
        <Button href={ROUTES.RESEND_ACTIVATION_EMAIL()} variant="tertiary">
          {t("sign_in.resend_activation")}
        </Button>
      </LinksWrapper>
    </>
  );
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

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <FormLayout>{page}</FormLayout>;
};

export default SignIn;
