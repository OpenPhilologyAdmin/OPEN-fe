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
  apparatusIndexVisible?: boolean;
  forcedState?: API.TokenState;
  withSup?: boolean;
};

type StyledProps = {
  $clickable: boolean;
  $variant: API.TokenState;
  highlighted?: boolean;
  $apparatusIndexVisible?: boolean;
};

const getActionableTokenVariantStyle = (
  color: string,
  highlighted: boolean,
  clickable: boolean,
) => {
  return css`
    ${clickable && "cursor: pointer"};
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
  ${({ $apparatusIndexVisible }) =>
    $apparatusIndexVisible &&
    css`
      margin-right: 3px;
    `}
  ${({ $variant, highlighted, $clickable }) => {
    if ($variant === "not_evaluated") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.actionsSecondary, !!highlighted, $clickable)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.actionsSecondary, true, $clickable)}
        }
      `;
    }

    if ($variant === "evaluated_with_multiple") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.actionsPrimary, !!highlighted, $clickable)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.actionsPrimary, true, $clickable)}
        }
      `;
    }

    if ($variant === "evaluated_with_single") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.textSecondary, !!highlighted, $clickable)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.textSecondary, true, $clickable)}
        }
      `;
    }

    return css`
      color: ${({ theme }) => theme.colors.textSecondary};
    `;
  }}
`;

function Token({
  token,
  forcedState,
  mode,
  highlighted,
  apparatusIndexVisible = true,
  onSelectToken,
  ...props
}: TokenProps) {
  const editModeTypographyVariant = useMemo(
    () => ((forcedState || token.state) === "one_variant" ? "body-regular" : "body-bold"),
    [forcedState, token.state],
  );

  return (
    <Wrapper
      {...props}
      onClick={() => {
        if (onSelectToken) onSelectToken(token);
      }}
      $clickable={!!onSelectToken}
      $variant={forcedState || token.state}
      highlighted={highlighted}
      $apparatusIndexVisible={apparatusIndexVisible && token.apparatus_index}
      variant={mode === "READ" ? "body-regular" : editModeTypographyVariant}
    >
      {token.t}
      {apparatusIndexVisible && token.apparatus_index && <Sup>({token.apparatus_index})</Sup>}
    </Wrapper>
  );
}

export default memo(Token);
