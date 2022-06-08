import { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

import styled, { css, DefaultTheme } from "styled-components";
import { Url } from "url";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "primary-outline"
  | "secondary-outline"
  | "primary-ghost"
  | "secondary-ghost";

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
    /** Only support by ghost variations */
    underline?: boolean;
  };

type GetterProps = {
  variant?: ButtonVariant;
  theme: DefaultTheme;
  disabled?: boolean;
  small?: boolean;
  underline?: boolean;
};

export const getColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled && variant) {
    if (
      [
        "primary",
        "secondary",
        "primary-outline",
        "secondary-outline",
        "primary-ghost",
        "secondary-ghost",
      ].includes(variant)
    )
      return colors.textDimmed;
  }

  if (variant === "primary" || variant === "secondary") return colors.textPrimary;

  if (variant === "primary-outline" || variant === "primary-ghost") return colors.actionsPrimary;

  if (variant === "secondary-outline" || variant === "secondary-ghost")
    return colors.actionsSecondary;

  return null;
};

export const getBackgroundColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (variant === "primary" || variant === "secondary") return colors.actionsDisabled;

    if (variant === "primary-outline") return colors.backgroundPrimary;

    if (variant === "primary-ghost" || variant === "secondary-ghost") return "transparent";
  }

  if (variant === "primary") return colors.actionsPrimary;

  if (variant === "secondary") return colors.actionsSecondary;

  if (variant === "primary-outline" || variant === "secondary-outline")
    return colors.backgroundPrimary;

  if (variant === "primary-ghost" || variant === "secondary-ghost") return "transparent";

  return null;
};

export const getBorderColor = ({ variant, theme: { colors }, disabled }: GetterProps) => {
  if (disabled) {
    if (
      variant === "primary" ||
      variant === "secondary" ||
      variant === "primary-outline" ||
      variant === "secondary-outline"
    )
      return colors.actionsDisabled;

    if (variant === "primary-ghost" || variant === "secondary-ghost") return "transparent";
  }

  if (variant === "primary" || variant === "primary-outline") return colors.actionsPrimary;

  if (variant === "secondary" || variant === "secondary-outline") return colors.actionsSecondary;

  if (variant === "primary-ghost" || variant === "secondary-ghost") return "transparent";

  return null;
};

export const getPadding = ({ variant, small }: GetterProps) => {
  if (variant === "primary-ghost" || variant === "secondary-ghost") {
    if (small) return "6px 0px";

    return "12px 0px";
  }

  if (small) return "6px 12px";

  return "12px 24px";
};

export const getLineHeight = ({ small }: GetterProps) => {
  if (small) return "16px";

  return "20px";
};

export const getFontSize = ({ small }: GetterProps) => {
  if (small) return "14px";

  return "16px";
};

export const getCursor = ({ disabled }: GetterProps) => {
  if (disabled) return "not-allowed";

  return "pointer";
};

export const getUnderlineStyles = ({ variant, theme, disabled, underline }: GetterProps) => {
  if (!underline) return;

  if (variant === "primary-ghost") {
    return css`
      &:after {
        content: "";
        width: 100%;
        position: absolute;
        height: 2px;
        background: ${disabled ? theme.colors.textDimmed : theme.colors.actionsPrimary};
        left: 0;
        bottom: 0;
      }
    `;
  }

  if (variant === "secondary-ghost") {
    return css`
      &:after {
        content: "";
        width: 100%;
        position: absolute;
        height: 2px;
        background: ${disabled ? theme.colors.textDimmed : theme.colors.actionsSecondary};
        left: 0;
        bottom: 0;
      }
    `;
  }
};

const BaseButton = styled.button<BaseButtonProps>`
  display: inline-flex;
  align-items: baseline;
  position: relative;
  margin: 0;
  border: 2px solid;
  outline: none;
  max-height: ${props => (props.small ? "32px" : "48px")};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => getPadding({ ...props })};
  font-size: ${props => getFontSize({ ...props })};
  border-color: ${props => getBorderColor({ ...props })};
  background-color: ${props => getBackgroundColor({ ...props })};
  color: ${props => getColor({ ...props })};
  line-height: ${props => getLineHeight({ ...props })};
  cursor: ${props => getCursor({ ...props })};
  ${props => getUnderlineStyles({ ...props })}

  // TODO Adjust in OPLU-120 with global icons setup */
  svg {
    height: 24px;
    width: 24px;
    color: ${props => getColor({ ...props })};
  }
`;

function Button({ variant = "primary", left, right, children, href, ...props }: ButtonProps) {
  return href ? (
    <Link href={href} passHref>
      <BaseButton as="a" variant={variant} {...props}>
        {left}
        {children}
        {right}
      </BaseButton>
    </Link>
  ) : (
    <BaseButton variant={variant} {...props}>
      {left}
      {children}
      {right}
    </BaseButton>
  );
}

export default Button;
