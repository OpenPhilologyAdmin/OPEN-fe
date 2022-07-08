import { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

import Spinner from "@/assets/images/icons/spinner.svg";
import styled, { css, DefaultTheme, keyframes } from "styled-components";
import { Url } from "url";

import Typography from "../typography";

type ButtonVariant = "primary" | "secondary" | "tertiary";

type ButtonMode = "text" | "icon";

type StateProps = {
  disabled?: boolean;
  /** only supported by mode "text" */
  isLoading?: boolean;
  variant?: ButtonVariant;
  mode?: ButtonMode;
  small?: boolean;
};

type BaseButtonProps = StateProps & {
  underline?: boolean;
};

type LeftWithLoadingProps = {
  left?: ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
};

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  Omit<ComponentPropsWithoutRef<"a">, "href"> &
  StateProps & {
    left?: ReactNode;
    right?: ReactNode;
    href?: Url | string;
  };

type GetterProps = StateProps & {
  theme: DefaultTheme;
};

const iconsWrapperStyles = css`
  height: 24px;
  width: 24px;
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const loaderStyles = css`
  animation: ${rotateAnimation} 1s linear infinite;
`;

const getColor = ({ variant, theme: { colors }, disabled, isLoading }: GetterProps) => {
  if (disabled && variant && !isLoading) {
    if (["primary", "secondary", "tertiary"].includes(variant)) return colors.textDimmed;
  }

  if (variant === "primary") return colors.textPrimary;

  if (variant === "secondary" || variant === "tertiary") return colors.actionsPrimary;

  return null;
};

const getHoverColor = ({ variant, theme: { colors }, disabled, isLoading }: GetterProps) => {
  if (disabled && variant && !isLoading) {
    if (["primary", "secondary", "tertiary"].includes(variant)) return colors.textDimmed;
  }

  if (variant === "primary") return colors.textPrimary;

  if (variant === "secondary" || variant === "tertiary") return colors.actionsSecondary;

  return null;
};

const getBackgroundColor = ({ variant, theme: { colors }, disabled, isLoading }: GetterProps) => {
  if (disabled && !isLoading) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.backgroundPrimary;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary") return colors.actionsPrimary;

  if (variant === "secondary") return colors.backgroundPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getHoverBackgroundColor = ({
  variant,
  theme: { colors },
  disabled,
  isLoading,
}: GetterProps) => {
  if (disabled && !isLoading) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.backgroundPrimary;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary") return colors.actionsSecondary;

  if (variant === "secondary") return colors.backgroundPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getBorderColor = ({ variant, theme: { colors }, disabled, isLoading }: GetterProps) => {
  if (disabled && !isLoading) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.textDimmed;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary" || variant === "secondary") return colors.actionsPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getHoverBorderColor = ({ variant, theme: { colors }, disabled, isLoading }: GetterProps) => {
  if (disabled && !isLoading) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.textDimmed;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary" || variant === "secondary") return colors.actionsSecondary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getPadding = ({ variant, small, mode }: GetterProps) => {
  if (mode === "icon") {
    if (small) return "4px 2px";

    return "12px";
  }

  if (variant === "tertiary") {
    if (small) return "6px 0px";

    return "12px 0px";
  }

  if (small) return "6px 12px";

  return "12px 24px";
};

const getCursor = ({ disabled }: GetterProps) => {
  if (disabled) return "not-allowed";

  return "pointer";
};

const getFocusStyles = ({ mode, variant }: GetterProps) => {
  if (mode === "text" && variant === "tertiary") return null;

  return css`
    box-shadow: ${({ theme: { colors } }) => colors.focusShadow};
  `;
};

const getHoverUnderlineStyles = ({ variant, theme, disabled, mode }: GetterProps) => {
  if (disabled || mode === "icon") return;

  if (variant === "tertiary") {
    return css`
      &:after {
        content: "";
        width: 100%;
        position: absolute;
        height: 2px;
        left: 0;
        bottom: 0;
        background: ${disabled ? theme.colors.textDimmed : theme.colors.actionsSecondary};
      }
    `;
  }
};

const getFocusUnderlineStyles = ({ variant, theme, disabled, mode }: GetterProps) => {
  if (disabled || mode === "icon") return;

  if (variant === "tertiary") {
    return css`
      &:after {
        content: "";
        width: 100%;
        position: absolute;
        height: 4px;
        left: 0;
        bottom: 0;
        background: ${theme.colors.focus};
      }
    `;
  }
};

const BaseButton = styled.button<BaseButtonProps>`
  display: inline-flex;
  align-items: center;
  position: relative;
  margin: 0;
  border: 2px solid;
  outline: none;
  max-height: ${props => (props.small ? "32px" : "48px")};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => getPadding({ ...props })};
  border-color: ${props => getBorderColor({ ...props })};
  background-color: ${props => getBackgroundColor({ ...props })};
  color: ${props => getColor({ ...props })};
  cursor: ${props => getCursor({ ...props })};

  svg {
    fill: ${props => getColor({ ...props })};
    ${({ isLoading }) => isLoading && loaderStyles};
  }

  &:hover {
    color: ${props => getHoverColor({ ...props })};
    background-color: ${props => getHoverBackgroundColor({ ...props })};
    border-color: ${props => getHoverBorderColor({ ...props })};
    ${props => getHoverUnderlineStyles({ ...props })}

    svg {
      fill: ${props => getHoverColor({ ...props })};
      ${({ isLoading }) => isLoading && loaderStyles};
    }
  }

  :focus-visible {
    ${props => getFocusStyles({ ...props })}
  }

  :focus-visible:not(:hover) {
    ${props => getFocusUnderlineStyles({ ...props })}
  }
`;

const Left = styled.div<GetterProps>`
  ${iconsWrapperStyles}
  margin-right: 4px;
`;

const Right = styled.div<GetterProps>`
  ${iconsWrapperStyles}
  margin-left: 4px;
`;

function LeftWithLoading({ left, isLoading, variant }: LeftWithLoadingProps) {
  if (isLoading)
    return (
      <Left>
        <Spinner />
      </Left>
    );

  return left ? <Left variant={variant}>{left}</Left> : null;
}

function Button({
  variant = "primary",
  mode = "text",
  left,
  right,
  children,
  href,
  isLoading,
  ...props
}: ButtonProps) {
  const buttonTypographyVariant = props.small ? "button-small" : "button-default";

  return href ? (
    <Link href={href} passHref>
      <BaseButton as="a" isLoading={isLoading} variant={variant} {...props}>
        <LeftWithLoading isLoading={isLoading} variant={variant} left={left} />
        <Typography variant={buttonTypographyVariant}>{children}</Typography>
        {right && <Right variant={variant}>{right}</Right>}
      </BaseButton>
    </Link>
  ) : (
    <BaseButton variant={variant} mode={mode} isLoading={isLoading} {...props}>
      <LeftWithLoading isLoading={isLoading} variant={variant} left={left} />
      {mode === "text" && <Typography variant={buttonTypographyVariant}>{children}</Typography>}
      {mode === "icon" && children}
      {right && <Right variant={variant}>{right}</Right>}
    </BaseButton>
  );
}

export default Button;
