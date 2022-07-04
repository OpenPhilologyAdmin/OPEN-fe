import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Button from "@/components/button";
import SignInForm from "@/components/sign-in-form";
import { ROUTES } from "@/constants/routes";
import AuthLayout from "@/layouts/auth";
import { isLoggedInServerSide } from "@/services/auth";
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
        <Button href={ROUTES.HOME()} variant="tertiary">
          {t("sign_in.resend_activation")}
        </Button>
      </LinksWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale, ...context }) => {
  if (isLoggedInServerSide(context)) {
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
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignIn;
