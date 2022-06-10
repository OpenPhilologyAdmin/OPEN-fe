import { Children, ComponentPropsWithoutRef, Fragment } from "react";

import ChevronRightIcon from "@/assets/images/icons/chevron-small-right.svg";
import styled from "styled-components";

const Wrapper = styled.nav`
  margin: 16px 0;
  color: ${props => props.theme.colors.textPrimary};
`;

const ItemWrapper = styled.span`
  text-decoration: underline;
  line-height: 24px;
`;

const ListWrapper = styled.ol`
  display: flex;
`;

const BreadCrumbsDivider = styled(ChevronRightIcon)`
  fill: ${props => props.theme.colors.textPrimary};
  margin: 0 4px;
`;

type BreadcrumbsProps = ComponentPropsWithoutRef<"nav">;

function Breadcrumbs({ children, ...props }: BreadcrumbsProps) {
  const childrenArray = Children.toArray(children);

  return (
    <Wrapper {...props}>
      <ListWrapper>
        {childrenArray.map((child, index) => (
          <Fragment key={index}>
            <ItemWrapper>{child}</ItemWrapper>
            {index !== childrenArray.length - 1 && <BreadCrumbsDivider />}
          </Fragment>
        ))}
      </ListWrapper>
    </Wrapper>
  );
}

export { BreadcrumbsItem } from "./breadcrumbs-item";

export default Breadcrumbs;
