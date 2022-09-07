import { ComponentPropsWithoutRef, ReactElement, useState } from "react";

import styled, { css } from "styled-components";

export type PanelProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  isRotatedWhenClosed?: boolean;
  headerSlots?: {
    mainNodes: {
      action: ReactElement;
      text: ReactElement;
    };
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
  position: relative;
  height: 100%;
  width: 100%;
`;

const ClosedRotatedWrapper = styled.div`
  width: 58px;
`;

const ClosedWrapper = styled.div`
  height: 48px;
  width: 100%;
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

const ClosedRotatedHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
`;

const ClosedRotatedHeaderActionNode = styled.div`
  padding: 24px 0;
`;

const Header = styled.div`
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  ${barStyles};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderActionText = styled.div`
  margin-left: 8px;
`;

const Main = styled.div`
  padding: 24px;
  width: 100%;
`;

function usePanel() {
  const [isOpen, setIsOpen] = useState(true);
  const togglePanelVisibility = () => setIsOpen(previousState => !previousState);

  return { isOpen, togglePanelVisibility };
}

function Panel({
  isOpen,
  headerSlots,
  children,
  isRotatedWhenClosed = true,
  ...props
}: PanelProps) {
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
    </OpenWrapper>
  ) : isRotatedWhenClosed ? (
    <ClosedRotatedWrapper {...props}>
      {headerSlots && (
        <ClosedRotatedHeader>
          <ClosedRotatedHeaderActionNode>
            {headerSlots.mainNodes.action}
          </ClosedRotatedHeaderActionNode>
          <RotateWrapper>
            <RotateElement>{headerSlots.mainNodes.text}</RotateElement>
          </RotateWrapper>
        </ClosedRotatedHeader>
      )}
    </ClosedRotatedWrapper>
  ) : (
    <ClosedWrapper {...props}>
      {headerSlots && (
        <Header>
          <HeaderActions>
            {headerSlots.mainNodes.action}
            <HeaderActionText>{headerSlots.mainNodes.text}</HeaderActionText>
          </HeaderActions>
          <div>{headerSlots.actionNode}</div>
        </Header>
      )}
    </ClosedWrapper>
  );
}

export { usePanel };
export default Panel;
