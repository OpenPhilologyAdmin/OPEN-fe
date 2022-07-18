import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ConfirmAccountView from "@/components/confirm-account";
import Typography from "@/components/typography";
import { CONFIRM_ACCOUNT_TOKEN_KEY } from "@/constants/confirm-email-token";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import FormLayout from "@/layouts/base/with-form";
import { hasCookieServerSide } from "@/services/auth";
import { withAuth } from "@/services/auth/with-auth";
import styled from "styled-components";

type ConfirmAccountPageProps = {
  confirmAccountToken?: string;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function ConfirmAccount({ confirmAccountToken }: ConfirmAccountPageProps) {
  const { isApproved } = useUser();
  const { t } = useTranslation();

  if (confirmAccountToken) {
    return <ConfirmAccountView confirmAccountToken={confirmAccountToken} />;
  }

  if (isApproved) {
    return (
      <Wrapper>
        <Typography variant="body-bold">{t("confirm_account")}</Typography>
        <Typography>{t("confirm_account")}</Typography>
      </Wrapper>
    );
  }

  return null;
}

export const getServerSideProps = withAuth(
  async ({ locale, ...context }, user) => {
    let confirmAccountToken: string | null = null;

    if (
      CONFIRM_ACCOUNT_TOKEN_KEY in context.query &&
      typeof context.query[CONFIRM_ACCOUNT_TOKEN_KEY] === "string"
    ) {
      confirmAccountToken = context.query[CONFIRM_ACCOUNT_TOKEN_KEY];
    }

    // account already approved
    if (user?.account_approved) {
      return {
        redirect: {
          destination: ROUTES.HOME(),
          permanent: false,
        },
      };
    }

    // not logged in and no token in URL
    if (!hasCookieServerSide(context) && !confirmAccountToken) {
      return {
        redirect: {
          destination: ROUTES.SIGN_IN(),
          permanent: false,
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale as string, ["common"])),
        confirmAccountToken,
        user,
      },
    };
  },
  { protectedPage: false },
);

ConfirmAccount.getLayout = function getLayout(page: ReactElement) {
  return <FormLayout>{page}</FormLayout>;
};

export default ConfirmAccount;
