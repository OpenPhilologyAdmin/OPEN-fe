import { ComponentPropsWithRef } from "react";

import Typography from "@/components/typography";
import styled from "styled-components";

type TrProps = ComponentPropsWithRef<"tr"> & {
  active?: boolean;
};

const TableComponent = styled.table`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  border-collapse: collapse;
`;

const Thead = styled.thead``;
const Tbody = styled.tbody``;

const Th = styled(Typography).attrs({ forwardedAs: "th", variant: "body-bold" })<
  ComponentPropsWithRef<"th">
>`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  text-align: ${props => props.align || "center"};
`;

const Td = styled(Typography).attrs({ forwardedAs: "td", variant: "body-regular" })<
  ComponentPropsWithRef<"td">
>`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.tableBorder};
  text-align: ${props => props.align || "center"};
`;

const Tr = styled.tr<TrProps>`
  ${Td} {
    background-color: ${({ active, theme: { colors } }) =>
      active ? colors.tableRowActiveBackground : colors.backgroundPrimary};
  }
`;

const Table = { Container: TableComponent, Thead, Tbody, Tr, Th, Td };

export { TableComponent as Container, Thead, Tbody, Tr, Th, Td };
export default Table;
