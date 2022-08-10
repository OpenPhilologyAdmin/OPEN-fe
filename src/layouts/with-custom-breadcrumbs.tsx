import { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

import BaseBreadcrumbs, { Breadcrumb, BreadcrumbsItem } from "@/components/features/breadcrumbs";
import Header from "@/components/ui/header";
import styled from "styled-components";

const Logout = dynamic(() => import("@/components/features/logout"), {
  ssr: false,
});

type Variant = "LIGHT" | "DARK";

type Align = "TOP" | "CENTER";

type StyledProps = {
  $variant?: Variant;
};

type Props = {
  children: ReactElement;
  breadcrumbs: Breadcrumb[];
  variant?: Variant;
  align?: Align;
};

type ContentProps = {
  align: Align;
};

const Main = styled.main<StyledProps>`
  /* Compensate header height */
  height: calc(100vh - 70px);
  padding: ${({ $variant }) => ($variant === "LIGHT" ? "0" : "0px 24px 16px 24px")};
  background: ${({ theme, $variant }) => $variant === "LIGHT" && theme.colors.backgroundPrimary};
  background-image: ${({ $variant }) => $variant === "DARK" && 'url("/images/background.jpg")'};
  background-size: ${({ $variant }) => $variant === "DARK" && "cover"}; ;
`;

const Content = styled.div<ContentProps>`
  display: flex;
  align-items: ${({ align }) => (align === "TOP" ? "flex-start" : "center")};
  justify-content: center;
  /* Compensate header + breadcrumbs height */
  height: calc(100vh - 128px);
  width: 100%;
`;

const Breadcrumbs = styled(BaseBreadcrumbs)<StyledProps>`
  padding: ${({ $variant }) => $variant === "LIGHT" && "16px 24px"};
`;

function WithCustomBreadcrumbs({
  breadcrumbs,
  children,
  align = "CENTER",
  variant = "DARK",
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Header>
        <Logout />
      </Header>
      <Main $variant={variant}>
        <Breadcrumbs variant={variant} $variant={variant}>
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
        <Content align={align}>{children}</Content>
      </Main>
    </>
  );
}

export default WithCustomBreadcrumbs;
