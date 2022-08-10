import styled, { css } from "styled-components";

interface LabelProps {
  disabled?: boolean;
  isLoading?: boolean;
  isChecked?: boolean;
}

export const Label = styled.label<LabelProps>`
  display: block;
  position: relative;
  opacity: ${({ disabled }) => (disabled ? "0.7" : "1")};
  width: 34px;
  height: 14px;
  background-color: white;
  border-radius: 32px;
  transition: 200ms;
  cursor: ${({ disabled, isLoading }) => (disabled || isLoading ? "normal" : "pointer")};
`;

export const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

interface CircleProps {
  isChecked?: boolean;
  isLoading?: boolean;
}

export const Circle = styled.span<CircleProps>`
  width: 20px;
  height: 20px;
  background-color: ${({ theme: { colors } }) => colors.actionsPrimary};
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
  border-style: solid;
  border-width: 0px;
  border-image-source: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.06) 20%,
    rgba(255, 255, 255, 0)
  );
  border-image-slice: 1;
  border-radius: 50%;
  position: absolute;
  top: -4px;
  left: 0;
  transition: 200ms;
  overflow: hidden;
  ${({ isLoading }) =>
    isLoading &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: -10%;
        left: -10%
        width: 100%;
        height: 120%;
        animation: 200% 1200ms linear infinite;
        background: linear-gradient(to right, transparent, green, transparent);
      }
    `};
`;
