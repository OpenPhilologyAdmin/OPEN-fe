import { ComponentPropsWithoutRef } from "react";

import styled from "styled-components";

export const BaseButton = styled.button`
  color: ${props => props.theme.colors.textPrimary};
`;

type ButtonProps = ComponentPropsWithoutRef<"button">;

function Button({ children, ...props }: ButtonProps) {
  return <BaseButton {...props}>{children}</BaseButton>;
}

export default Button;
