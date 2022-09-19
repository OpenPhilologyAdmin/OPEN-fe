import { useTranslation } from "next-i18next";

import {
  Container,
  TableRecordSkeletonLoader,
  Tbody as BaseTbody,
  Td,
  Th,
  Thead,
  Tr as BaseTr,
} from "@/components/ui/table";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled, { css } from "styled-components";

import DeleteWitnessButton from "./delete-witness-button";
import EditWitnessNameForm from "./edit-witness-name-form";
import { useGetWitnessListByProjectId } from "./query";
import SetDefaultWitnessRadio from "./set-default-witness-radio";

export type WitnessListTableProps = {
  project: API.Project;
};

type ViewProps = {
  witnesses: API.Witness[];
  project: API.Project;
};

type ErrorProps = {
  apiError: API.Error;
};

const mediumWidth = 148;
const smallWidth = 112;
// compensate other columns, 1 medium column and 2 small
const wideWidth = css`
  width: calc(100% - ${mediumWidth + smallWidth * 2}px);
`;

const Wrapper = styled.div`
  width: 100%;
  // compensate padding
  max-height: calc(100% - 24px);
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
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

function WitnessListThead() {
  const { t } = useTranslation();

  return (
    <Thead>
      <Tr>
        <SmallTh>{t("witness_list.default_column")}</SmallTh>
        <WideTh align="left">{t("witness_list.witness_name_column")}</WideTh>
        <MediumTh>{t("witness_list.siglum_column")}</MediumTh>
        <SmallTh>{t("witness_list.delete_column")}</SmallTh>
      </Tr>
    </Thead>
  );
}

function View({ project, witnesses }: ViewProps) {
  const canDelete = witnesses.length > 1;

  return (
    <Wrapper>
      <WideTable>
        <WitnessListThead />
        <Tbody>
          {witnesses.map(witness => {
            return (
              <Tr key={witness.id} data-testid="row">
                <SmallTd>
                  <SetDefaultWitnessRadio
                    checked={witness.default}
                    id={witness.id}
                    witness={witness}
                    projectId={project.id}
                  />
                </SmallTd>
                <WideTd align="left">
                  <EditWitnessNameForm
                    name={witness.name}
                    projectId={project.id}
                    witness={witness}
                  />
                </WideTd>
                <MediumTd>{witness.siglum}</MediumTd>
                <SmallTd>
                  <DeleteWitnessButton
                    data-testid="delete-button"
                    disabled={!canDelete}
                    projectId={project.id}
                    witnessId={witness.id}
                  />
                </SmallTd>
              </Tr>
            );
          })}
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function Loader() {
  return (
    <Wrapper>
      <WideTable>
        <WitnessListThead />
        <Tbody>
          {[...Array(5).keys()].map(count => (
            <Tr key={count}>
              <SmallTh>
                <TableRecordSkeletonLoader />
              </SmallTh>
              <WideTh align="left">
                <TableRecordSkeletonLoader />
              </WideTh>
              <MediumTh>
                <TableRecordSkeletonLoader />
              </MediumTh>
              <SmallTh>
                <TableRecordSkeletonLoader />
              </SmallTh>
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
        <WitnessListThead />
        <Tbody>
          <Tr>
            <Td>{apiError.error}</Td>
          </Tr>
        </Tbody>
      </WideTable>
    </Wrapper>
  );
}

function WitnessListTable({ project }: WitnessListTableProps) {
  const {
    data,
    isLoading,
    isError,
    error: axiosError,
  } = useGetWitnessListByProjectId({ projectId: project.id });
  const apiError = unwrapAxiosError(axiosError);
  const witnesses = data?.records;

  if (isError && apiError) return <Error apiError={apiError} />;

  if (isLoading && !witnesses) return <Loader />;

  if (project && witnesses) {
    return <View project={project} witnesses={witnesses} />;
  }

  return null;
}

export default WitnessListTable;
