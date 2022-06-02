import { JSXElementConstructor, ReactElement } from "react";
import { useTranslation } from "next-i18next";

import Breadcrumbs, { BreadcrumbsItem } from "@/components/breadcrumbs";
import { useBreadcrumbs } from "@/components/breadcrumbs/use-breadcrumbs";
import Header from "@/components/header";
import styled from "styled-components";

type Props = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
};

const Main = styled.main`
  /* Compensate header height */
  height: calc(100vh - 72px);
  padding: 16px 24px;
  background-image: url("/images/background.png");
`;

function BaseLayout({ children }: Props) {
  const { breadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <Main>
        {breadcrumbs && (
          <Breadcrumbs>
            <BreadcrumbsItem href="/">{t("home.route_name")}</BreadcrumbsItem>
            {breadcrumbs.map(breadcrumb => (
              <BreadcrumbsItem key={breadcrumb.href} href={breadcrumb.href}>
                {breadcrumb.label}
              </BreadcrumbsItem>
            ))}
          </Breadcrumbs>
        )}
        {children}
      </Main>
    </>
  );
}

export default BaseLayout;
