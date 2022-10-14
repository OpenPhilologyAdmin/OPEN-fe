import { ComponentPropsWithoutRef, ReactNode, useState } from "react";

import styled, { css } from "styled-components";

import NewTypography from "../typography/new_index";

type TabProps = ComponentPropsWithoutRef<"div"> & {
  icon?: ReactNode;
  isSelected: boolean;
  onSelect: () => void;
};

type StyledProps = {
  $isSelected: boolean;
};

const IconWrapper = styled.div`
  margin-right: 4px;
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const TabWrapper = styled.div<StyledProps>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  height: 46px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.actionsPrimary};
  cursor: pointer;
  user-select: none;

  svg {
    fill: ${({ theme }) => theme.colors.actionsPrimary};
  }

  &:before {
    display: block;
    z-index: 1;
    position: absolute;
    height: 48px;
    width: 1px;
    right: 0;
    background: ${({ theme }) => theme.colors.borderSecondary};
    content: "";
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      position: relative;
      background: ${({ theme }) => theme.colors.backgroundPrimary};
      color: ${({ theme }) => theme.colors.textSecondary};

      svg {
        fill: ${({ theme }) => theme.colors.textSecondary};
      }

      &:after {
        display: block;
        position: absolute;
        height: 5px;
        width: 100%;
        bottom: -5px;
        background: ${({ theme }) => theme.colors.backgroundPrimary};
        border-right: 1px white;
        content: "";
      }
    `};
`;

function useTabs<InitialStateType>(initialState: InitialStateType) {
  const [selectedTab, setSelectedTab] = useState<InitialStateType>(initialState);

  return { selectedTab, setSelectedTab };
}

function Tab({ isSelected, onSelect, children, icon }: TabProps) {
  return (
    <TabWrapper $isSelected={isSelected} onClick={onSelect}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <NewTypography variant="body" bold>
        {children}
      </NewTypography>
    </TabWrapper>
  );
}

export { TabsWrapper, Tab, useTabs };
