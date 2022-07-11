import { ReactNode } from "react";

import styled from "styled-components";

import BaseLayout from ".";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  width: 100%;
  // compensate padding
  max-height: calc(100% - 24px);
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function WithTableLayout({ children }: Props) {
  return (
    <BaseLayout align="TOP">
      <Wrapper>{children}</Wrapper>
    </BaseLayout>
  );
}

export default WithTableLayout;
