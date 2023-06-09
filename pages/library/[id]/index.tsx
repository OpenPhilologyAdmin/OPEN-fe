import { ReactElement } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Breadcrumb } from "@/components/features/breadcrumbs";
import ProjectView from "@/components/features/project-view";
import { ROUTES } from "@/constants/routes";
import { useCurrentProjectMode } from "@/hooks/use-current-project-mode";
import WithProjectView from "@/layouts/with-project-view";
import { withAuth } from "@/services/auth/with-auth";
import { getProjectById } from "@/services/project";

type Props = {
  project: API.Project;
};

function Project({ project }: Props) {
  const { t } = useTranslation();
  const { mode } = useCurrentProjectMode();

  return (
    <>
      <Head>
        <title>{t("project.title", { mode })}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProjectView project={project} />
    </>
  );
}

export const getServerSideProps = withAuth(
  async (context, _, token) => {
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

Project.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs: Breadcrumb[] = [
    { href: ROUTES.LIBRARY(), label: "Library" },
    { href: ROUTES.PROJECT(page.props.project.id), label: page.props.project.name },
  ];

  return (
    <WithProjectView align="TOP" breadcrumbs={breadcrumbs} project={page.props.project}>
      {page}
    </WithProjectView>
  );
};

export default Project;
