import { ComponentPropsWithoutRef } from "react";

import styled from "styled-components";

type SupProps = ComponentPropsWithoutRef<"sup">;

const BaseSup = styled.sup`
  font-weight: 800;
  // Using smallest possible to not expand row-height for the project view
  line-height: 1px;
`;

function Sup({ children, ...props }: SupProps) {
  return <BaseSup {...props}>{children}</BaseSup>;
}

export default Sup;
