import { ComponentPropsWithRef } from "react";

import Typography from "@/components/typography";
import styled from "styled-components";

type TrProps = ComponentPropsWithRef<"tr"> & {
  active?: boolean;
};

const TableComponent = styled.table`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  display: flex;
  width: 100%;
`;
const Tbody = styled.tbody`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Th = styled(Typography).attrs({ forwardedAs: "th", variant: "body-bold" })<
  ComponentPropsWithRef<"th">
>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || "center"};
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const Td = styled(Typography).attrs({ forwardedAs: "td", variant: "body-regular" })<
  ComponentPropsWithRef<"td">
>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || "center"};
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.tableBorder};
`;

const Tr = styled.tr<TrProps>`
  display: flex;
  width: 100%;

  ${Td} {
    background-color: ${({ active, theme: { colors } }) =>
      active ? colors.tableRowActiveBackground : colors.backgroundPrimary};
  }
`;

export { TableComponent as Container, Thead, Tbody, Tr, Th, Td };
