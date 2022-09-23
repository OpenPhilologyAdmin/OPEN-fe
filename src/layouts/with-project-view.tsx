import { ReactElement, useContext } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

import BaseBreadcrumbs, { Breadcrumb, BreadcrumbsItem } from "@/components/features/breadcrumbs";
import AddWitnessButton from "@/components/features/witness-list-table/add-witness-button";
import Header from "@/components/ui/header";
import Toggle from "@/components/ui/toggle";
import { TokenContext } from "@/contexts/selectedToken";
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
  project: API.Project;
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

const TopBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-right: 10px;
`;

function WithProjectView({ breadcrumbs, children, align = "CENTER", project }: Props) {
  const { t } = useTranslation();
  const { mode, toggleMode } = useCurrentProjectMode();

  const { tokenContextId } = useContext(TokenContext);

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
        <TopBarWrapper>
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
          <ButtonWrapper>
            <AddWitnessButton project={project} small tokenId={tokenContextId} />
          </ButtonWrapper>
        </TopBarWrapper>
        <Content align={align}>{children}</Content>
      </Main>
    </>
  );
}

export default WithProjectView;
