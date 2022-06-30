import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";

import styled, { css } from "styled-components";

import Typography from "../typography";
import BaseCharacterLimit from "./character-limit";
import BaseErrorMessage from "./error-message";

type BaseInputProps = {
  left?: boolean;
  right?: boolean;
  invalid?: boolean;
};

type WrapperProps = {
  invalid?: boolean;
};

export type InputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  left?: ReactNode;
  right?: ReactNode;
  invalid?: boolean;
  current?: number | string;
  errorMessage?: string;
};

const sideNodeStyle = css`
  display: flex;
  align-items: center;
`;

const InputInnerWrapper = styled.div<WrapperProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  height: 48px;
  width: 100%;
  border: solid 2px
    ${({ theme: { colors }, invalid }) => {
      if (invalid) return colors.error;

      return colors.border;
    }};
  border-radius: ${({ theme: { borderRadius } }) => borderRadius.sm};
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};

  :focus-within {
    border-color: ${({ theme: { colors }, invalid }) => !invalid && colors.actionsPrimary};
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
  line-height: 24px;
  color: ${({ theme: { colors } }) => colors.textSecondary};
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};

  ::placeholder {
    color: ${({ theme: { colors } }) => colors.textSecondary};
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
  cursor: text;
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
  ({ label, left, right, invalid, current, errorMessage, ...props }, ref) => {
    return (
      <InputStyledWrapper>
        <InputInnerWrapper invalid={invalid}>
          {label && (
            <Label htmlFor={props.id}>
              <Typography variant="small-bold">{label}</Typography>
            </Label>
          )}
          {left && <Left>{left}</Left>}
          <BaseInput type="text" ref={ref} {...props} />
          {right && <Right>{right}</Right>}
          {props.max && current !== undefined && (
            <CharacterLimit max={props.max} current={current} />
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
