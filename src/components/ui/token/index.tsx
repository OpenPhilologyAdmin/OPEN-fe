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
  selected?: boolean;
  withSplitStyles?: boolean;
  withTokenIdInApparatusIndex?: boolean;
};

type StyledProps = {
  $clickable: boolean;
  $variant: API.TokenState;
  highlighted?: boolean;
  selected?: boolean;
  $apparatusIndexVisible?: boolean;
  $withSplitStyles?: boolean;
};

const splitStyles = css`
  border: 1px solid ${({ theme }) => theme.colors.actionsPrimary};
  box-shadow: 0px 0px 8px ${({ theme }) => theme.colors.actionsPrimary};
  background-color: ${({ theme }) => convertHexToRGBA(theme.colors.actionsPrimary, 0.12)};
`;

const getActionableTokenVariantStyle = (
  actionColor: string,
  highlighted: boolean,
  selected: boolean,
) => {
  return css`
    color: ${actionColor};
    border: 1px solid transparent;

    ${highlighted &&
    !selected &&
    css`
      background-color: ${convertHexToRGBA(actionColor, 0.12)};
      border: 1px solid ${convertHexToRGBA(actionColor, 0.32)};
    `};

    ${selected &&
    css`
      background-color: #ffe6007a;
      border: 1px solid transparent;
    `};
  `;
};

const Wrapper = styled(Typography)<StyledProps>`
  ${({ $clickable }) => $clickable && "cursor: pointer"};

  ${({ $apparatusIndexVisible }) =>
    $apparatusIndexVisible &&
    css`
      margin-right: 3px;
    `}
  ${({ $variant, highlighted, selected }) => {
    if ($variant === "not_evaluated") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.actionsSecondary, !!highlighted, !!selected)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.actionsSecondary, true, !!selected)}
        }
      `;
    }

    if ($variant === "evaluated_with_multiple") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.actionsPrimary, !!highlighted, !!selected)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.actionsPrimary, true, !!selected)}
        }
      `;
    }

    if ($variant === "evaluated_with_single") {
      return css`
        ${({ theme }) =>
          getActionableTokenVariantStyle(theme.colors.textSecondary, !!highlighted, !!selected)}

        &:hover {
          ${({ theme }) =>
            getActionableTokenVariantStyle(theme.colors.textSecondary, true, !!selected)}
        }
      `;
    }

    return css`
      color: ${({ theme }) => theme.colors.textSecondary};
      border: 1px solid transparent;
      ${selected &&
      css`
        background-color: #ffe6007a;
      `};
    `;
  }}

   ${({ $withSplitStyles }) => {
    if ($withSplitStyles) {
      return css`
        ${splitStyles}

        &:hover {
          ${splitStyles}
        }
      `;
    }
  }}
`;

function Token({
  token,
  forcedState,
  mode,
  highlighted,
  apparatusIndexVisible = true,
  selected,
  onSelectToken,
  withSplitStyles,
  withTokenIdInApparatusIndex,
  ...props
}: TokenProps) {
  const editModeTypographyVariant = useMemo(
    () => ((forcedState || token.state) === "one_variant" ? "body-regular" : "body-bold"),
    [forcedState, token.state],
  );

  // when using copy feature with apparatus index visible
  // this allows to end selection on the apparatus index and not the token itself
  const supProps = withTokenIdInApparatusIndex ? { id: String(token.id) } : {};

  return (
    <Wrapper
      {...props}
      onClick={() => {
        if (onSelectToken) {
          onSelectToken(token);
        }
      }}
      $clickable={!!onSelectToken}
      $variant={forcedState || token.state}
      highlighted={highlighted}
      $apparatusIndexVisible={apparatusIndexVisible && token.apparatus_index}
      variant={mode === "READ" ? "body-regular" : editModeTypographyVariant}
      selected={selected}
      $withSplitStyles={withSplitStyles}
    >
      {token.t}
      {apparatusIndexVisible && token.apparatus_index && (
        <Sup {...supProps}>({token.apparatus_index})</Sup>
      )}
    </Wrapper>
  );
}

export default memo(Token);
