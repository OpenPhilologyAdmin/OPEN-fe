import { Children, ComponentPropsWithoutRef, Fragment } from "react";

import ChevronRightIcon from "@/assets/images/icons/chevron-small-right.svg";
import styled from "styled-components";

import Typography from "../../ui/typography";
import { Breadcrumb as BreadcrumbType } from "./use-breadcrumbs";

export type Breadcrumb = BreadcrumbType;

export type Variant = "LIGHT" | "DARK";

type StyledProps = {
  $variant: Variant;
};

const Wrapper = styled.nav<StyledProps>`
  padding: 16px 0;
  color: ${({ theme, $variant }) => $variant === "LIGHT" && theme.colors.textSecondary};
  background: ${({ theme, $variant }) => $variant === "LIGHT" && theme.colors.backgroundPrimary};
`;

const ListWrapper = styled.ol`
  display: flex;
`;

const BreadCrumbsDivider = styled(ChevronRightIcon)<StyledProps>`
  fill: ${({ $variant, theme }) =>
    $variant === "LIGHT" ? theme.colors.textSecondary : theme.colors.textPrimary};
  margin: 0 4px;
`;

const ChildWrapper = styled(Typography)<StyledProps>`
  color: ${({ theme, $variant }) => $variant === "DARK" && theme.colors.textPrimary};
`;

const LastChildWrapper = styled(Typography)<StyledProps>`
  color: ${({ theme, $variant }) =>
    $variant === "LIGHT" ? theme.colors.textSecondary : theme.colors.textPrimary};
`;

type BreadcrumbsProps = ComponentPropsWithoutRef<"nav"> & {
  variant?: Variant;
};

// TODO translations for breadcrumbs
function Breadcrumbs({ variant = "DARK", children, ...props }: BreadcrumbsProps) {
  const childrenArray = Children.toArray(children);
  const isLastBreadcrumb = (items: Array<any>, currentIndex: number) =>
    items.length - 1 === currentIndex;

  return (
    <Wrapper {...props} $variant={variant}>
      <ListWrapper>
        {childrenArray.map((child, index) => (
          <Fragment key={index}>
            {isLastBreadcrumb(childrenArray, index) ? (
              <LastChildWrapper variant="body-bold" $variant={variant}>
                {child}
              </LastChildWrapper>
            ) : (
              <ChildWrapper variant="body-link" $variant={variant}>
                {child}
              </ChildWrapper>
            )}
            {index !== childrenArray.length - 1 && <BreadCrumbsDivider $variant={variant} />}
          </Fragment>
        ))}
      </ListWrapper>
    </Wrapper>
  );
}

export { BreadcrumbsItem } from "./breadcrumbs-item";
export { useBreadcrumbs } from "./use-breadcrumbs";

export default Breadcrumbs;
