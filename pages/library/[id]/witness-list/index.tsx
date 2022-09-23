import { ReactElement } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Breadcrumb } from "@/components/features/breadcrumbs";
import WitnessListTable from "@/components/features/witness-list-table";
import AddWitnessButton from "@/components/features/witness-list-table/add-witness-button";
import { ROUTES } from "@/constants/routes";
import WithTableLayout from "@/layouts/shared/with-table";
import WithCustomBreadcrumbs from "@/layouts/with-custom-breadcrumbs";
import { withAuth } from "@/services/auth/with-auth";
import { getProjectById } from "@/services/project";
import styled from "styled-components";

type Props = {
  project: API.Project;
};

const Footer = styled.div`
  position: fixed;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  left: 0;
  height: 72px;
`;

function WitnessList({ project }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("witness_list.title")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WitnessListTable project={project} />
      <Footer>
        <AddWitnessButton project={project} variant="secondary" />
      </Footer>
    </>
  );
}

export const getServerSideProps = withAuth(
  async (context, user, token) => {
    const projectId: string | null = typeof context.query.id === "string" ? context.query.id : null;
    let project: API.Project | null = null;
    let previousRoute: string | null = null;

    if (!projectId) {
      return {
        notFound: true,
      };
    }

    try {
      if (token) {
        const { data } = await getProjectById({ id: Number(projectId), token });

        project = data;
      }
    } catch (error) {
      console.error(error);

      return {
        notFound: true,
      };
    }

    // cannot see the page without project info

    if (!project) {
      return {
        notFound: true,
      };
    }

    const referer = context.req.headers.referer;

    if (referer) {
      previousRoute = referer.substring(referer.lastIndexOf("/"), referer.length);
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ["common"])),
        project,
        previousRoute,
      },
    };
  },
  { protectedPage: true },
);

WitnessList.getLayout = function getLayout(page: ReactElement) {
  const firstBreadcrumb =
    page.props.previousRoute === ROUTES.IMPORT_FILE()
      ? {
          href: ROUTES.IMPORT_FILE(),
          label: "Import file",
        }
      : {
          href: ROUTES.LIBRARY(),
          label: "Library",
        };
  const breadcrumbs: Breadcrumb[] = [
    firstBreadcrumb,
    {
      href: ROUTES.WITNESS_LIST(page.props.project.id),
      label: `${page.props.project.name}: Witnesses`,
    },
  ];

  return (
    <WithCustomBreadcrumbs align="TOP" breadcrumbs={breadcrumbs}>
      <WithTableLayout>{page}</WithTableLayout>
    </WithCustomBreadcrumbs>
  );
};

export default WitnessList;
