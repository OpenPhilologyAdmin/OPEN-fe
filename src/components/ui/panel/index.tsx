import { ComponentPropsWithoutRef, ReactElement, useState } from "react";

import styled, { css } from "styled-components";

export type PanelProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  headerSlots?: {
    mainNodes: {
      action: ReactElement;
      text: ReactElement;
    };
    actionNode?: ReactElement;
  };
  footerSlots?: {
    mainNode?: ReactElement;
    actionNode?: ReactElement;
  };
};

const barStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const OpenWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const ClosedWrapper = styled.div`
  width: 58px;
`;

const RotateWrapper = styled.div`
  position: relative;
`;

const RotateElement = styled.div`
  padding-top: 20px;
  display: flex;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
  overflow: visible;
`;

const ClosedHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const ClosedHeaderActionNode = styled.div`
  padding: 24px 0;
`;

const Header = styled.div`
  ${barStyles};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderActionText = styled.div`
  margin-left: 8px;
`;

// TODO style footer slots when they will be used
const Footer = styled.div`
  ${barStyles};
`;

const Main = styled.div`
  padding: 16px;
  width: 100%;
  height: calc(100% - 96px);
`;

function usePanel() {
  const [isOpen, setIsOpen] = useState(true);
  const togglePanelVisibility = () => setIsOpen(previousState => !previousState);

  return { isOpen, togglePanelVisibility };
}

function Panel({ isOpen, headerSlots, footerSlots, children, ...props }: PanelProps) {
  return isOpen ? (
    <OpenWrapper {...props}>
      {headerSlots && (
        <Header>
          <HeaderActions>
            {headerSlots.mainNodes.action}
            <HeaderActionText>{headerSlots.mainNodes.text}</HeaderActionText>
          </HeaderActions>
          <div>{headerSlots.actionNode}</div>
        </Header>
      )}
      <Main>{children}</Main>
      {footerSlots && (
        <Footer>
          <div>{footerSlots.mainNode}</div>
          <div>{footerSlots.actionNode}</div>
        </Footer>
      )}
    </OpenWrapper>
  ) : (
    <ClosedWrapper>
      {headerSlots && (
        <ClosedHeader>
          <ClosedHeaderActionNode>{headerSlots.mainNodes.action}</ClosedHeaderActionNode>
          <RotateWrapper>
            <RotateElement>{headerSlots.mainNodes.text}</RotateElement>
          </RotateWrapper>
        </ClosedHeader>
      )}
    </ClosedWrapper>
  );
}

export { usePanel };
export default Panel;
