import { ComponentPropsWithoutRef, ElementType } from "react";

import styled from "styled-components";

const Header = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 32px;
`;

const BodyRegular = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
`;

const BodyBold = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

const BodyLink = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  text-decoration-line: underline;
`;

const ButtonDefault = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const ButtonSmall = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`;

const SmallRegular = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
`;

const SmallBold = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const Tiny = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.05em;
`;

const TextRegular = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
`;

const TextBold = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 30px;
`;

const TextSuper = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
`;

const SmallTextRegular = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
`;

const SmallTextBold = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
`;

const SmallTextSuper = styled.span`
  font-family: "Roboto Slab";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
`;

const TYPOGRAPHY_VARIANTS = {
  header: Header,
  "body-regular": BodyRegular,
  "body-bold": BodyBold,
  "body-link": BodyLink,
  "button-default": ButtonDefault,
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

type TypographyProps = ComponentPropsWithoutRef<"span"> & {
  variant?: keyof typeof TYPOGRAPHY_VARIANTS;
  as?: ElementType;
};

function Typography({ variant = "body-regular", children, ...props }: TypographyProps) {
  const TypographyVariant = TYPOGRAPHY_VARIANTS[variant];

  return <TypographyVariant {...props}>{children}</TypographyVariant>;
}

export default Typography;
