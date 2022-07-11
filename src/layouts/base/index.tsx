import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import LogoutIcon from "@/assets/images/icons/power.svg";
import UserIcon from "@/assets/images/icons/user.svg";
import Breadcrumbs, { BreadcrumbsItem } from "@/components/breadcrumbs";
import { useBreadcrumbs } from "@/components/breadcrumbs/use-breadcrumbs";
import Button from "@/components/button";
import Header from "@/components/header";
import Typography from "@/components/typography";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import { signOut } from "@/services/auth";
import styled from "styled-components";

type Align = "TOP" | "CENTER";

type Props = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  align?: Align;
};

type ContentProps = {
  align: Align;
};

const Main = styled.main`
  /* Compensate header height */
  height: calc(100vh - 70px);
  padding: 16px 24px;
  background-image: url("/images/background.jpg");
  background-size: cover;
`;

const Content = styled.div<ContentProps>`
  display: flex;
  align-items: ${({ align }) => (align === "TOP" ? "flex-start" : "center")};
  justify-content: center;
  /* Compensate header + breadcrumbs height */
  height: calc(100vh - 144px);
  width: 100%;
`;

const UserName = styled(Typography)`
  margin: 0 24px 0 4px;
`;

const LoggedInContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

function BaseLayout({ children, align = "CENTER" }: Props) {
  const { breadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();
  const { push } = useRouter();
  const { user, isLoggedIn, setUser } = useUser();
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  // TODO create logout button component
  const handleLogout = async () => {
    await signOut();
    push(ROUTES.SIGN_IN());
    setUser(undefined);
  };

  return (
    <>
      <Header>
        {!isSSR && isLoggedIn && (
          <LoggedInContentWrapper>
            {user && (
              <>
                <UserIcon />
                <UserName>{user?.name}</UserName>
              </>
            )}
            <Button left={<LogoutIcon />} onClick={handleLogout} variant="primary" small>
              {t("header.logout")}
            </Button>
          </LoggedInContentWrapper>
        )}
      </Header>
      <Main>
        {breadcrumbs && (
          <Breadcrumbs>
            <BreadcrumbsItem href="/">{t("home.route_name")}</BreadcrumbsItem>
            {breadcrumbs.slice(0, -1).map(breadcrumb => (
              <BreadcrumbsItem key={breadcrumb.href} href={breadcrumb.href}>
                {breadcrumb.label}
              </BreadcrumbsItem>
            ))}
            {breadcrumbs.length >= 1 && (
              <BreadcrumbsItem>{breadcrumbs[breadcrumbs.length - 1].label}</BreadcrumbsItem>
            )}
          </Breadcrumbs>
        )}
        <Content align={align}>{children}</Content>
      </Main>
    </>
  );
}

export default BaseLayout;
