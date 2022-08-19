import styled, { css } from "styled-components";

import Sup from "../sup";
import Typography, { TypographyProps } from "../typography";

type TokenProps = TypographyProps & {
  token: API.Token;
  mode: "READ" | "EDIT";
};

type StyledProps = {
  $variant: API.TokenState;
};

const getTokenStyle = ({ $variant }: StyledProps) => {
  if ($variant === "not_evaluated") {
    return css`
      color: ${({ theme }) => theme.colors.actionsSecondary};
    `;
  }

  if ($variant === "evaluated_with_multiple") {
    return css`
      color: ${({ theme }) => theme.colors.actionsPrimary};
    `;
  }

  if ($variant === "evaluated_with_single") {
    return css`
      color: ${({ theme }) => theme.colors.textSecondary};
    `;
  }

  return css`
    color: ${({ theme }) => theme.colors.textSecondary};
  `;
};

const Wrapper = styled(Typography)<StyledProps>`
  margin-right: 4px;
  ${({ $variant }) => getTokenStyle({ $variant })}
`;

function Token({ token, mode, ...props }: TokenProps) {
  const editModeTypographyVariant = token.state === "one_variant" ? "body-regular" : "body-bold";

  return (
    <Wrapper
      {...props}
      $variant={token.state}
      variant={mode === "READ" ? "body-regular" : editModeTypographyVariant}
    >
      {token.t}
      {token.apparatus_index && <Sup>({token.apparatus_index})</Sup>}
    </Wrapper>
  );
}

export default Token;
