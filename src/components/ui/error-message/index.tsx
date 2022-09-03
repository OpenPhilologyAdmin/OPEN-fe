import { ComponentPropsWithoutRef } from "react";

import InfoIcon from "@/assets/images/icons/info-circle.svg";
import styled from "styled-components";

import Typography from "../typography";

type ErrorMessageProps = ComponentPropsWithoutRef<"span"> & {
  text?: string;
};

const Message = styled(Typography)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.error};

  svg {
    margin-right: 4px;
    fill: ${({ theme }) => theme.colors.error};
  }
`;

function ErrorMessage({ text, ...props }: ErrorMessageProps) {
  if (!text) return null;

  return (
    <Message variant="small-bold" role="alert" {...props}>
      <InfoIcon role="graphics-symbol" />
      {text}
    </Message>
  );
}

export default ErrorMessage;
