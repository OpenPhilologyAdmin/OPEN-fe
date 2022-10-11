import { ComponentPropsWithRef, forwardRef, useEffect, useRef } from "react";

import { mergeRefs } from "@/utils/merge-refs";
import styled, { css, DefaultTheme } from "styled-components";

import BaseCharacterLimit from "../character-limit";
import BaseErrorMessage from "../error-message";
import Typography from "../typography";

type ResizeProps = {
  resize?: boolean;
};

type BaseTextAreaProps = ResizeProps & {
  left?: boolean;
  right?: boolean;
  invalid?: boolean;
  disabled?: boolean;
};

type StyledProps = ResizeProps & {
  invalid?: boolean;
  disabled?: boolean;
  withCounter?: boolean;
};

type GetTextAreaColorsProps = StyledProps & {
  theme: DefaultTheme;
};

export type TextAreaProps = ComponentPropsWithRef<"textarea"> &
  ResizeProps & {
    label?: string;
    invalid?: boolean;
    disabled?: boolean;
    current?: number | string;
    errorMessage?: string;
    adjustInitialHeightToContent?: boolean;
  };

export const getTextAreaColor = ({ disabled, theme: { colors } }: GetTextAreaColorsProps) => {
  if (disabled) {
    return colors.textDimmed;
  }

  return colors.textSecondary;
};

const TextAreaInnerWrapper = styled.div<StyledProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  width: 100%;
  border-radius: ${({ theme: { borderRadius } }) => borderRadius.sm};
  border: solid 1px
    ${({ theme: { colors }, invalid, disabled }) => {
      if (invalid) return colors.error;

      if (disabled) return colors.textDimmed;

      return colors.borderPrimary;
    }};
  background-color: ${({ theme: { colors }, disabled }) => {
    if (disabled) return colors.backgroundSecondary;

    return colors.backgroundPrimary;
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

  :focus-within {
    box-shadow: ${({ theme: { colors }, invalid }) => !invalid && colors.focusShadow};
  }

  &::after {
    content: "";
    position: absolute;
    display: ${({ resize }) => (resize ? "inline-block" : "none")};
    position: absolute;
    z-index: 2;
    bottom: 4px;
    right: 4px;
    width: 12px;
    height: 12px;
    background-image: url("/images/icons/textarea-resize-custom-icon.svg");
    background-repeat: no-repeat;
    pointer-events: none;
    ${({ theme, disabled, resize, withCounter }) =>
      resize &&
      !withCounter &&
      css`
        background-color: ${disabled
          ? theme.colors.backgroundSecondary
          : theme.colors.backgroundPrimary};
        width: 15px;
        height: 15px;
        bottom: 1px;
        right: 1px;
      `}
  }
`;

const BaseTextArea = styled.textarea<BaseTextAreaProps>`
  position: relative;
  z-index: 1;
  outline: none;
  padding: 12px;
  opacity: 1;
  margin: 0;
  min-width: 0;
  width: 100%;
  border: none;
  min-height: 48px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: ${({ theme: { borderRadius } }) => borderRadius.sm};
  color: ${({ theme, disabled }) => getTextAreaColor({ theme, disabled })};
  resize: ${({ resize }) => (resize ? "vertical" : "none")};
  background-color: ${({ theme: { colors }, disabled }) => {
    if (disabled) return colors.backgroundSecondary;

    return "transparent";
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

  ::placeholder {
    color: ${({ theme: { colors } }) => colors.textSecondary};
  }

  ::-webkit-resizer {
    display: none;
  }
`;

const Label = styled.label`
  position: absolute;
  z-index: 3;
  top: -10px;
  left: 8px;
  padding: 0 8px;
  height: 20px;
  background-color: ${({ theme: { colors } }) => colors.backgroundPrimary};
  color: ${({ theme: { colors } }) => colors.textDimmed};
`;

const CharacterLimit = styled(BaseCharacterLimit)<ResizeProps>`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  ${({ resize }) => resize && "padding-right: 20px;"};
`;

const ErrorMessage = styled(BaseErrorMessage)`
  margin-top: 4px;
`;

export const TextAreaStyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: ${({ theme: { borderRadius } }) => borderRadius.sm};
`;

/**Only support vertical resize */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      invalid,
      current,
      errorMessage,
      disabled,
      adjustInitialHeightToContent = false,
      resize = false,
      ...props
    },
    ref,
  ) => {
    const withCounter = !!(props.maxLength && current !== undefined);
    const autoHeightRef = useRef<HTMLTextAreaElement>(null);
    const mergedRef = mergeRefs(ref, autoHeightRef);

    useEffect(() => {
      if (autoHeightRef.current && adjustInitialHeightToContent) {
        autoHeightRef.current.style.height = autoHeightRef.current.scrollHeight + "px";
      }
    }, [adjustInitialHeightToContent]);

    return (
      <TextAreaStyledWrapper>
        <TextAreaInnerWrapper
          disabled={disabled}
          invalid={invalid}
          resize={resize}
          withCounter={withCounter}
        >
          {label && (
            <Label htmlFor={props.id}>
              <Typography variant="small-bold">{label}</Typography>
            </Label>
          )}
          <BaseTextArea ref={mergedRef} disabled={disabled} resize={resize} {...props} />
          {props.maxLength && current !== undefined && (
            <CharacterLimit max={props.maxLength} current={current} resize={resize} />
          )}
        </TextAreaInnerWrapper>
        {invalid && !!errorMessage && <ErrorMessage text={errorMessage} />}
      </TextAreaStyledWrapper>
    );
  },
);

TextArea.displayName = "TextArea";

const TextAreaLoader = styled.div`
  height: 96px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.actionsDisabled};
`;

export { TextAreaLoader };
export { useCharacterLimit } from "../character-limit";

export default TextArea;
