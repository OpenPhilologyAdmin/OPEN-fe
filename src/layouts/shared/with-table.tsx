import { ReactElement } from "react";

import styled from "styled-components";

type Props = {
  children: ReactElement;
};

const Wrapper = styled.div`
  width: 100%;
  // compensate padding
  max-height: calc(100% - 24px);
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function WithTableLayout({ children }: Props) {
  return <Wrapper>{children}</Wrapper>;
}

export default WithTableLayout;
