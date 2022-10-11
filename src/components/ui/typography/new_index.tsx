import { ComponentPropsWithoutRef, ElementType } from "react";

import styled, { css } from "styled-components";

export type TypographyProps = ComponentPropsWithoutRef<"label"> &
  ComponentPropsWithoutRef<"span"> & {
    variant?: keyof typeof TYPOGRAPHY_VARIANTS;
    as?: ElementType;
    truncate?: boolean;
  } & ConditionalProps;

type CommonProps = {
  truncate: boolean;
};

type ConditionalProps =
  | {
      variant?: "header";
      bold?: never;
      link?: never;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "body";
      bold?: boolean;
      link?: never;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "body";
      bold?: never;
      link?: boolean;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "small";
      bold?: boolean;
      link?: never;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "small" | "regular";
      bold?: boolean;
      link?: never;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "strong";
      bold?: boolean;
      link?: never;
      compact?: never;
      shrink?: never;
    }
  | {
      variant?: "strong";
      bold?: true;
      link?: never;
      compact?: true;
      shrink?: true;
    }
  | {
      variant?: "strong";
      bold?: true;
      link?: never;
      compact?: true;
      shrink?: boolean;
    }
  | {
      variant?: "tiny";
      bold?: never;
      link?: never;
      compact?: never;
      shrink?: never;
    };

type Props = CommonProps & ConditionalProps;

const truncateStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Header = styled.span<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const Body = styled.span<Props>`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: ${({ bold }) => (bold ? "600" : "400")};
  ${({ link }) =>
    link &&
    css`
      font-weight: 500;
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.actionsPrimary};
    `}
  ${({ truncate }) => truncate && truncateStyle};
`;

const Tiny = styled.span<Props>`
  font-family: "Inter";
  font-style: normal;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  ${({ truncate }) => truncate && truncateStyle};
`;

const Small = styled.span<Props>`
  font-family: "Inter";
  font-style: normal;
  font-size: 14px;
  font-weight: ${({ bold }) => (bold ? "600" : "400")};
  line-height: 20px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const Regular = styled.span<Props>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-size: 16px;
  font-weight: ${({ bold }) => (bold ? "600" : "400")};
  line-height: 30px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const Strong = styled.span<Props>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-size: 20px;
  font-weight: ${({ bold }) => (bold ? "700" : "400")};
  line-height: ${({ compact }) => (compact ? "24px" : "30px")};
  ${({ shrink }) =>
    shrink &&
    css`
      font-size: 14px;
      letter-spacing: 0.01em;
    `}
  ${({ truncate }) => truncate && truncateStyle};
`;

const TYPOGRAPHY_VARIANTS = {
  header: Header,
  body: Body,
  tiny: Tiny,
  small: Small,
  regular: Regular,
  strong: Strong,
};

function NewTypography({ variant = "body", children, ...props }: TypographyProps) {
  const TypographyVariant = TYPOGRAPHY_VARIANTS[variant];

  return <TypographyVariant {...props}>{children}</TypographyVariant>;
}

export default NewTypography;
