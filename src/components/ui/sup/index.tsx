import { ComponentPropsWithoutRef } from "react";

import styled from "styled-components";

type SupProps = ComponentPropsWithoutRef<"sup">;

const BaseSup = styled.sup`
  font-weight: 800;
`;

function Sup({ children, ...props }: SupProps) {
  return <BaseSup {...props}>{children}</BaseSup>;
}

export default Sup;
