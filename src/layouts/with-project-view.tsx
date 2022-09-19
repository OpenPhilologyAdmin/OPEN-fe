import { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

import BaseBreadcrumbs, { Breadcrumb, BreadcrumbsItem } from "@/components/features/breadcrumbs";
import Header from "@/components/ui/header";
import Toggle from "@/components/ui/toggle";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import styled from "styled-components";

const Logout = dynamic(() => import("@/components/features/logout"), {
  ssr: false,
});

type Align = "TOP" | "CENTER";

type Props = {
  children: ReactElement;
  breadcrumbs: Breadcrumb[];
  align?: Align;
};

type ContentProps = {
  align: Align;
};

const Main = styled.main`
  /* Compensate header height */
  height: calc(100vh - 72px);
  max-height: calc(100vh - 72px);
  padding: 0;
  background: ${({ theme }) => theme.colors.backgroundPrimary}; ;
`;

const Content = styled.div<ContentProps>`
  display: flex;
  align-items: ${({ align }) => (align === "TOP" ? "flex-start" : "center")};
  justify-content: center;
  /* Compensate header + breadcrumbs height */
  height: calc(100vh - 128px);
  width: 100%;
`;

const Breadcrumbs = styled(BaseBreadcrumbs)`
  padding: 16px 24px;
`;

const ToggleWrapper = styled.div`
  margin-right: 24px;
`;

function WithProjectView({ breadcrumbs, children, align = "CENTER" }: Props) {
  const { t } = useTranslation();
  const { mode, toggleMode } = useCurrentProjectMode();

  return (
    <>
      <Header>
        <ToggleWrapper>
          <Toggle
            value={mode}
            checked={mode === "EDIT"}
            onChange={toggleMode}
            label={t("project.edit_mode")}
            id="mode-toggle"
          />
        </ToggleWrapper>

        <Logout />
      </Header>
      <Main>
        <Breadcrumbs variant="LIGHT">
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

export default WithProjectView;
