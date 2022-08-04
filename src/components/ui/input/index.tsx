import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";

import styled, { css, DefaultTheme } from "styled-components";

import Typography from "../../ui/typography";
import BaseCharacterLimit from "./character-limit";
import BaseErrorMessage from "./error-message";

type BaseInputProps = {
  left?: boolean;
  right?: boolean;
  invalid?: boolean;
  disabled?: boolean;
};

type StyledProps = {
  invalid?: boolean;
  disabled?: boolean;
};

type GetInputColorsProps = StyledProps & {
  theme: DefaultTheme;
};

export type InputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  left?: ReactNode;
  right?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  current?: number | string;
  errorMessage?: string;
};

const sideNodeStyle = css`
  display: flex;
  align-items: center;
`;

export const getInputColor = ({ disabled, theme: { colors } }: GetInputColorsProps) => {
  if (disabled) {
    return colors.textDimmed;
  }

  return colors.textSecondary;
};

const InputInnerWrapper = styled.div<StyledProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  height: 48px;
  width: 100%;
  border: solid 2px
    ${({ theme: { colors }, invalid, disabled }) => {
      if (invalid) return colors.error;

      if (disabled) return colors.textDimmed;

      return colors.border;
    }};
  border-radius: ${({ theme: { borderRadius } }) => borderRadius.sm};
  background-color: ${({ theme: { colors }, disabled }) => {
    if (disabled) return colors.backgroundSecondary;

    return colors.backgroundPrimary;
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

  :focus-within {
    box-shadow: ${({ theme: { colors }, invalid }) => !invalid && colors.focusShadow};
  }
`;

const BaseInput = styled.input<BaseInputProps>`
  opacity: 1;
  margin: 0;
  min-width: 0;
  width: 100%;
  border: none;
  outline: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme, disabled }) => getInputColor({ theme, disabled })};
  background-color: ${({ theme: { colors }, disabled }) => {
    if (disabled) return colors.backgroundSecondary;

    colors.backgroundPrimary;
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

  ::placeholder {
    color: ${({ theme: { colors } }) => colors.textSecondary};
  }

  &[type="file"] {
    opacity: 0;
    z-index: -1;
  }
`;

const Label = styled.label`
  position: absolute;
  top: -10px;
  left: 8px;
  padding: 0 8px;
  height: 20px;
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};
  color: ${({ theme: { colors } }) => colors.textDimmed};
`;

const SideItem = styled.div`
  color: ${({ theme: { colors } }) => colors.textSecondary};
  font-size: 14px;
  white-space: nowrap;

  svg {
    font-size: 16px;
    line-height: 10px;
  }
`;

const Left = styled(SideItem)`
  ${sideNodeStyle}
  margin-right: 8px;
  order: -1;
`;

const Right = styled(SideItem)`
  ${sideNodeStyle}
  margin-left: 8px;
`;

const CharacterLimit = styled(BaseCharacterLimit)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const ErrorMessage = styled(BaseErrorMessage)`
  margin-top: 4px;
`;

export const InputStyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, left, right, invalid, current, errorMessage, disabled, ...props }, ref) => {
    return (
      <InputStyledWrapper>
        <InputInnerWrapper disabled={disabled} invalid={invalid}>
          {label && (
            <Label htmlFor={props.id}>
              <Typography variant="small-bold">{label}</Typography>
            </Label>
          )}
          <BaseInput type="text" ref={ref} disabled={disabled} {...props} />
          {left && <Left>{left}</Left>}
          {right && <Right>{right}</Right>}
          {props.maxLength && current !== undefined && (
            <CharacterLimit max={props.maxLength} current={current} />
          )}
        </InputInnerWrapper>
        {invalid && !!errorMessage && <ErrorMessage text={errorMessage} />}
      </InputStyledWrapper>
    );
  },
);

Input.displayName = "Input";

export { useCharacterLimit } from "./character-limit";

export default Input;

const InputLoader = styled.div`
  height: 48px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.actionsDisabled};
`;

export { InputLoader };
