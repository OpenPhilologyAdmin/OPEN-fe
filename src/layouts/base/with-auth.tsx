import { ReactNode } from "react";

import styled from "styled-components";

import BaseLayout from ".";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  width: 460px;
  padding: 48px;
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

function AuthLayout({ children }: Props) {
  return (
    <BaseLayout>
      <Wrapper>{children}</Wrapper>
    </BaseLayout>
  );
}

export default AuthLayout;
