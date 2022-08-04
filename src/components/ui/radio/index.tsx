import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

import styled from "styled-components";

import Typography from "../typography";

export type RadioProps = ComponentPropsWithoutRef<"input"> & {
  label?: ReactNode;
  invalid?: boolean;
};

type StyleProps = {
  disabled?: boolean;
  invalid?: boolean;
};

const RadioMark = styled.label<StyleProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 24px;
  width: 24px;
  z-index: 0;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: solid 2px;
  border-color: ${({ theme: { colors }, invalid, disabled }) => {
    if (disabled) return colors.actionsDisabled;

    if (invalid) return colors.error;

    return colors.actionsPrimary;
  }};
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};
  background-position: center;
`;

const Input = styled.input<StyleProps>`
  position: absolute;
  opacity: 0;
  z-index: 1;
  height: 24px;
  width: 24px;
  top: 0;
  left: 0;
  margin: 0;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  :checked ~ ${RadioMark} {
    background-color: ${({ theme: { colors }, invalid, disabled }) => {
      if (disabled) return colors.actionsDisabled;

      if (invalid) return colors.error;

      return colors.actionsPrimary;
    }};
  }

  :checked ~ ${RadioMark}::after {
    content: "";
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    position: absolute;
    top: 4px;
    left: 4px;
    height: 12px;
    width: 12px;
    z-index: 0;
    background-color: white;
  }

  :focus ~ ${RadioMark} {
    box-shadow: ${({ theme: { colors } }) => colors.focusShadow};
  }
`;

const Label = styled(Typography).attrs({ as: "label" })<StyleProps>`
  margin-left: 32px;
  color: ${({ theme: { colors }, invalid, disabled }) => {
    if (disabled) return colors.textDimmed;

    if (invalid) return colors.error;

    return colors.textSecondary;
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
  width: 100%;
`;

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ disabled, id, label, invalid, ...props }, ref) => {
    return (
      <Wrapper>
        <Input disabled={disabled} invalid={invalid} type="radio" {...props} ref={ref} id={id} />
        <RadioMark disabled={disabled} invalid={invalid} />
        {label && (
          <Label invalid={invalid} disabled={disabled} htmlFor={id} variant="body-regular">
            {label}
          </Label>
        )}
      </Wrapper>
    );
  },
);

Radio.displayName = "Radio";

export default Radio;
