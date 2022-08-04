import { ReactNode } from "react";

import styled from "styled-components";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  width: 460px;
  padding: 48px;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function FormLayout({ children }: Props) {
  return <Wrapper>{children}</Wrapper>;
}

export default FormLayout;
