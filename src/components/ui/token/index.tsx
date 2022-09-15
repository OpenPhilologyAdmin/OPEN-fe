import { memo, useMemo } from "react";

import { convertHexToRGBA } from "@/utils/hex-to-rgba";
import styled, { css } from "styled-components";

import Sup from "../sup";
import Typography, { TypographyProps } from "../typography";

type TokenProps = TypographyProps & {
  token: API.Token;
  mode: "READ" | "EDIT";
  highlighted?: boolean;
  onSelectToken?: (token: API.Token) => void;
};

type StyledProps = {
  $variant: API.TokenState;
  highlighted?: boolean;
};

const getActionableTokenVariantStyle = (color: string, highlighted: boolean) => {
  return css`
    cursor: pointer;
    color: ${color};
    border: 1px solid transparent;

    ${highlighted &&
    css`
      background-color: ${convertHexToRGBA(color, 0.12)};
      border: 1px solid ${convertHexToRGBA(color, 0.32)};
    `};
  `;
};

const Wrapper = styled(Typography)<StyledProps>`
  margin-right: 4px;
  ${({ $variant, highlighted }) => {
    if ($variant === "not_evaluated") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.actionsSecondary, !!highlighted)}

        &:hover {
          ${({ theme }) => getActionableTokenVariantStyle(theme.colors.actionsSecondary, true)}
        }
      `;
    }

    if ($variant === "evaluated_with_multiple") {
      return css`
        ${({ theme }) => getActionableTokenVariantStyle(theme.colors.actionsPrimary, !!highlighted)}

        &:hover {
          ${({ theme }) => getActionableTokenVariantStyle(theme.colors.actionsPrimary, true)}
        }
      `;
    }

    if ($variant === "evaluated_with_single") {
      return css`
        ${({ theme }) => getActionableTokenVariantStyle(theme.colors.textSecondary, !!highlighted)}

        &:hover {
          ${({ theme }) => getActionableTokenVariantStyle(theme.colors.textSecondary, true)}
        }
      `;
    }

    return css`
      color: ${({ theme }) => theme.colors.textSecondary};
    `;
  }}
`;

function Token({ token, mode, highlighted, onSelectToken, ...props }: TokenProps) {
  const editModeTypographyVariant = useMemo(
    () => (token.state === "one_variant" ? "body-regular" : "body-bold"),
    [token.state],
  );

  return (
    <Wrapper
      {...props}
      onClick={() => {
        if (onSelectToken) onSelectToken(token);
      }}
      $variant={token.state}
      highlighted={highlighted}
      variant={mode === "READ" ? "body-regular" : editModeTypographyVariant}
    >
      {token.t}
      {token.apparatus_index && <Sup>({token.apparatus_index})</Sup>}
    </Wrapper>
  );
}

export default memo(Token);
