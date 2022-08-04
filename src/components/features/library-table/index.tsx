import { ComponentPropsWithoutRef } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import {
  Container,
  TableRecordSkeletonLoader,
  Tbody as BaseTbody,
  Td,
  Th,
  Thead,
  Tr as BaseTr,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/hooks/use-user";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import dayjs from "dayjs";
import styled, { css } from "styled-components";

import DeleteProjectButton from "./delete-project-button";
import EditProjectNameForm from "./edit-project-name-form";
import { useGetProjectList } from "./query";

type LibraryTableProps = ComponentPropsWithoutRef<"div">;

type ViewProps = {
  projects: API.Project[];
  userId: number;
};

type ErrorProps = {
  apiError: API.Error;
};

const formatDateInTable = (date: string) => dayjs(date).format("YYYY-MM-DD");

const mediumWidth = 148;
const smallWidth = 112;
// compensate other columns, 4 medium columns and 2 small
const wideWidth = css`
  width: calc(100% - ${mediumWidth * 4 + smallWidth * 2}px);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: scroll;
`;

const WideTable = styled(Container)`
  width: 100%;
  min-width: 1150px;
`;

const WideTh = styled(Th)`
  ${wideWidth}
`;

const WideTd = styled(Td)`
  ${wideWidth}
`;

const MediumTh = styled(Th)`
  padding: 24px 0;
  width: ${mediumWidth}px;
`;

const SmallTh = styled(Th)`
  width: ${smallWidth}px;
`;

const MediumTd = styled(Td)`
  width: ${mediumWidth}px;
`;

const SmallTd = styled(Td)`
  width: ${smallWidth}px;
`;

const Tr = styled(BaseTr)`
  height: 72px;
`;

const Tbody = styled(BaseTbody)`
  overflow-y: scroll;
  // compensate wrapping UI to be responsive
  max-height: calc(100vh - 250px);
`;

function LibraryThead() {
  const { t } = useTranslation();

  return (
    <Thead>
      <Tr>
        <WideTh align="left">{t("library.document_name_column")}</WideTh>
        <MediumTh>{t("library.last_edit_by_column")}</MediumTh>
        <MediumTh>{t("library.last_edit_date_column")}</MediumTh>
        <MediumTh>{t("library.created_by_column")}</MediumTh>
        <MediumTh>{t("library.creation_date_column")}</MediumTh>
        <SmallTh>{t("library.witnesses_count_column")}</SmallTh>
        <SmallTh>{t("library.delete_column")}</SmallTh>
      </Tr>
    </Thead>
  );
}

function View({ projects, userId }: ViewProps) {
  return (
    <Wrapper>
      <WideTable>
        <LibraryThead />
        <Tbody>
          {projects.map(project => (
            <Tr key={project.id} data-testid="row">
              <WideTd align="left">
                <EditProjectNameForm name={project.name} id={project.id} />
              </WideTd>
              <MediumTd>{project.last_edit_by || "N/A"}</MediumTd>
              <MediumTd>{formatDateInTable(project.last_edit_date)}</MediumTd>
              <MediumTd>{project.created_by}</MediumTd>
              <MediumTd>{formatDateInTable(project.creation_date)}</MediumTd>
              <SmallTd>
                <Button
                  disabled={project.witnesses_count === 0}
                  variant="tertiary"
                  href={project.witnesses_count > 0 ? ROUTES.WITNESS_LIST(project.id) : undefined}
                >
                  {project.witnesses_count}
                </Button>
              </SmallTd>
              <SmallTd>
                <DeleteProjectButton
                  disabled={userId !== project.creator_id}
                  projectId={project.id}
                />
              </SmallTd>
            </Tr>
          ))}
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function Loader() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <WideTable>
        <LibraryThead />
        <Tbody>
          {[...Array(5).keys()].map(count => (
            <Tr key={count}>
              <WideTd align="left">
                <TableRecordSkeletonLoader />
              </WideTd>
              <MediumTd>
                <TableRecordSkeletonLoader />
              </MediumTd>
              <MediumTd>
                <TableRecordSkeletonLoader />
              </MediumTd>
              <MediumTd>
                <TableRecordSkeletonLoader />
              </MediumTd>
              <MediumTd>
                <TableRecordSkeletonLoader />
              </MediumTd>
              <SmallTd>
                <TableRecordSkeletonLoader />
              </SmallTd>
              <SmallTd>
                <Button isLoading disabled small>
                  {t("library.loading")}
                </Button>
              </SmallTd>
            </Tr>
          ))}
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function Error({ apiError }: ErrorProps) {
  return (
    <Wrapper>
      <WideTable>
        <LibraryThead />
        <Tbody>
          <Tr>
            <Td>{apiError.error}</Td>
          </Tr>
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function LibraryTable({ children, ...props }: LibraryTableProps) {
  const { user } = useUser();
  const { data, isLoading, isError, error: axiosError } = useGetProjectList();
  const apiError = unwrapAxiosError(axiosError);
  const projects = data?.records;

  if (isError && apiError) return <Error apiError={apiError} />;

  if (isLoading && !projects) return <Loader />;

  if (projects && user) {
    return <View {...props} projects={projects} userId={user.id} />;
  }

  return null;
}

export default LibraryTable;
