import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

import styled from "styled-components";

import Typography from "../typography";

type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  label?: ReactNode;
  invalid?: boolean;
};

type StyleProps = {
  disabled?: boolean;
  invalid?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
  width: 100%;
`;

const Checkmark = styled.div<StyleProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 24px;
  width: 24px;
  z-index: 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: solid 2px;
  border-color: ${({ theme: { colors }, invalid, disabled }) => {
    if (disabled) return colors.actionsDisabledStrong;

    if (invalid) return colors.error;

    return colors.actionsPrimary;
  }};
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};
  background-position: center;
`;

const Label = styled(Typography).attrs({ as: "label" })<StyleProps>`
  color: ${({ theme: { colors }, invalid, disabled }) => {
    if (disabled) return colors.textDimmed;

    if (invalid) return colors.error;

    return colors.textSecondary;
  }};
  margin-left: 32px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
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

  :checked ~ ${Checkmark} {
    background-color: ${({ theme: { colors }, invalid, disabled }) => {
      if (disabled) return colors.actionsDisabledStrong;

      if (invalid) return colors.error;

      return colors.actionsPrimary;
    }};

    background-image: url("/images/icons/check-small.svg");
  }

  :focus ~ ${Checkmark} {
    box-shadow: ${({ theme: { colors } }) => colors.focusShadow};
  }
`;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ disabled, id, label, invalid, ...props }, ref) => {
    return (
      <Wrapper>
        <Input disabled={disabled} invalid={invalid} type="checkbox" {...props} ref={ref} id={id} />
        <Checkmark disabled={disabled} invalid={invalid} />
        {label && (
          <Label invalid={invalid} disabled={disabled} htmlFor={id} variant="body-regular">
            {label}
          </Label>
        )}
      </Wrapper>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
