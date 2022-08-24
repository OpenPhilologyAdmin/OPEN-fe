import { ComponentPropsWithoutRef, ElementType } from "react";

import styled, { css } from "styled-components";

export type TypographyProps = ComponentPropsWithoutRef<"label"> &
  ComponentPropsWithoutRef<"span"> & {
    variant?: keyof typeof TYPOGRAPHY_VARIANTS;
    as?: ElementType;
    truncate?: boolean;
  };

type StyledProps = {
  truncate?: boolean;
};

const truncateStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Header = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const BodyRegular = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  ${({ truncate }) => truncate && truncateStyle};
`;

const BodyBold = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  ${({ truncate }) => truncate && truncateStyle};
`;

const BodyLink = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.colors.actionsPrimary};
  ${({ truncate }) => truncate && truncateStyle};
`;

const ButtonSmall = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const SmallRegular = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const SmallBold = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const Tiny = styled.span<StyledProps>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.05em;
  ${({ truncate }) => truncate && truncateStyle};
`;

const TextRegular = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const TextBold = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 30px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const TextSuper = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const SmallTextRegular = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
  ${({ truncate }) => truncate && truncateStyle};
`;

const SmallTextBold = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
  ${({ truncate }) => truncate && truncateStyle};
`;

const SmallTextSuper = styled.span<StyledProps>`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  ${({ truncate }) => truncate && truncateStyle};
`;

const TYPOGRAPHY_VARIANTS = {
  header: Header,
  "body-regular": BodyRegular,
  "body-bold": BodyBold,
  "body-link": BodyLink,
  "button-small": ButtonSmall,
  "small-regular": SmallRegular,
  "small-bold": SmallBold,
  tiny: Tiny,
  "text-regular": TextRegular,
  "text-bold": TextBold,
  "text-super": TextSuper,
  "small-text-regular": SmallTextRegular,
  "small-text-bold": SmallTextBold,
  "small-text-super": SmallTextSuper,
};

function Typography({ variant = "body-regular", children, ...props }: TypographyProps) {
  const TypographyVariant = TYPOGRAPHY_VARIANTS[variant];

  return <TypographyVariant {...props}>{children}</TypographyVariant>;
}

export default Typography;
