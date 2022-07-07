import { ReactElement } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import BookIcon from "@/assets/images/icons/book.svg";
import DocumentIcon from "@/assets/images/icons/document-plus.svg";
import EditIcon from "@/assets/images/icons/edit-2.svg";
import UsersIcon from "@/assets/images/icons/users-more.svg";
import Button from "@/components/button";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import AuthLayout from "@/layouts/auth";
import { withAuth } from "@/services/auth/with-auth";
import styled from "styled-components";

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  align-items: center;
  grid-row-gap: 24px;
`;

function Home() {
  const { isAdmin } = useUser();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("home.title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ButtonsWrapper>
        <Button href={ROUTES.HOME()} variant="primary" left={<EditIcon />}>
          {t("home.continue_editing")}
        </Button>
        <Button href={ROUTES.HOME()} variant="primary" left={<DocumentIcon />}>
          {t("home.create_new_edition")}
        </Button>
        <Button href={ROUTES.HOME()} variant="primary" left={<BookIcon />}>
          {t("home.go_to_library")}
        </Button>
        {isAdmin && (
          <Button href={ROUTES.HOME()} variant="primary" left={<UsersIcon />}>
            {t("home.manage_users")}
          </Button>
        )}
      </ButtonsWrapper>
    </>
  );
}

export const getServerSideProps = withAuth(
  async ({ locale }, user) => {
    return {
      props: {
        ...(await serverSideTranslations(locale as string, ["common"])),
        user,
      },
    };
  },
  { protectedPage: true },
);

Home.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Home;
