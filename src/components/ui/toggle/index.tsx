import { ComponentPropsWithoutRef, forwardRef, ReactNode, useState } from "react";

import styled from "styled-components";

import Typography from "../typography";

type ToggleProps = ComponentPropsWithoutRef<"input"> & {
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
`;

const InnerWrapper = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.borderSecondary};
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  height: 20px;
  width: 32px;
`;

const Checkmark = styled.div<StyleProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 24px;
  width: 24px;
  z-index: 0;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
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
  margin-left: 8px;
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

    transform: translateX(10px);
    background-image: url("/images/icons/check-small.svg");
  }

  :checked {
    transform: translateX(10px);
  }

  :focus ~ ${Checkmark} {
    box-shadow: ${({ theme: { colors } }) => colors.focusShadow};
  }
`;

function useToggle(defaultValue: boolean) {
  const [isOn, setIsOn] = useState(defaultValue);
  const toggle = () => setIsOn(previousState => !previousState);

  return { isOn, toggle };
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ disabled, id, label, invalid, ...props }, ref) => {
    return (
      <Wrapper>
        <InnerWrapper>
          <Input
            disabled={disabled}
            invalid={invalid}
            type="checkbox"
            {...props}
            ref={ref}
            id={id}
          />
          <Checkmark disabled={disabled} invalid={invalid} />
        </InnerWrapper>
        {label && (
          <Label invalid={invalid} disabled={disabled} htmlFor={id} variant="body-regular">
            {label}
          </Label>
        )}
      </Wrapper>
    );
  },
);

Toggle.displayName = "Toggle";

export { useToggle };
export default Toggle;
