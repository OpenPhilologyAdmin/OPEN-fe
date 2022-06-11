import { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

import styled, { css, DefaultTheme } from "styled-components";
import { Url } from "url";

import Typography from "../typography";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

type BaseButtonProps = {
  variant?: ButtonVariant;
  disabled?: boolean;
  small?: boolean;
  underline?: boolean;
};

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    variant?: ButtonVariant;
    small?: boolean;
    left?: ReactNode;
    right?: ReactNode;
    href?: Url | string;
  };

type GetterProps = {
  variant?: ButtonVariant;
  theme: DefaultTheme;
  disabled?: boolean;
  small?: boolean;
};

const iconsWrapperStyles = css`
  height: 24px;
  width: 24px;
`;

const getColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled && variant) {
    if (["primary", "secondary", "tertiary"].includes(variant)) return colors.textDimmed;
  }

  if (variant === "primary") return colors.textPrimary;

  if (variant === "secondary" || variant === "tertiary") return colors.actionsPrimary;

  return null;
};

const getHoverColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled && variant) {
    if (["primary", "secondary", "tertiary"].includes(variant)) return colors.textDimmed;
  }

  if (variant === "primary") return colors.textPrimary;

  if (variant === "secondary" || variant === "tertiary") return colors.actionsSecondary;

  return null;
};

const getBackgroundColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.backgroundPrimary;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary") return colors.actionsPrimary;

  if (variant === "secondary") return colors.backgroundPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getHoverBackgroundColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.backgroundPrimary;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary") return colors.actionsSecondary;

  if (variant === "secondary") return colors.backgroundPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getBorderColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.textDimmed;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary" || variant === "secondary") return colors.actionsPrimary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getHoverBorderColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (variant === "primary") return colors.actionsDisabled;

    if (variant === "secondary") return colors.textDimmed;

    if (variant === "tertiary") return "transparent";
  }

  if (variant === "primary" || variant === "secondary") return colors.actionsSecondary;

  if (variant === "tertiary") return "transparent";

  return null;
};

const getPadding = ({ variant, small }: GetterProps) => {
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

const getHoverUnderlineStyles = ({ variant, theme, disabled }: GetterProps) => {
  if (disabled) return;

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
  }

  &:hover {
    color: ${props => getHoverColor({ ...props })};
    background-color: ${props => getHoverBackgroundColor({ ...props })};
    border-color: ${props => getHoverBorderColor({ ...props })};
    ${props => getHoverUnderlineStyles({ ...props })}

    svg {
      fill: ${props => getHoverColor({ ...props })};
    }
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

function Button({ variant = "primary", left, right, children, href, ...props }: ButtonProps) {
  const buttonTypographyVariant = props.small ? "button-small" : "button-default";

  return href ? (
    <Link href={href} passHref>
      <BaseButton as="a" variant={variant} {...props}>
        {left && <Left variant={variant}>{left}</Left>}
        <Typography variant={buttonTypographyVariant}>{children}</Typography>
        {right && <Right variant={variant}>{right}</Right>}
      </BaseButton>
    </Link>
  ) : (
    <BaseButton variant={variant} {...props}>
      {left && <Left variant={variant}>{left}</Left>}
      <Typography variant={buttonTypographyVariant}>{children}</Typography>
      {right && <Right variant={variant}>{right}</Right>}
    </BaseButton>
  );
}

export default Button;
