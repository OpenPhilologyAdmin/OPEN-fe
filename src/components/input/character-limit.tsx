import { ComponentPropsWithoutRef, useEffect, useState } from "react";

import styled from "styled-components";

type UseCharacterLimitProps = string | number | readonly string[] | undefined;
type CharacterLimitProps = ComponentPropsWithoutRef<"span"> & {
  current: string | number | undefined;
  max: string | number;
};

const Label = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 0 8px;
  height: 20px;
  border-radius: ${({ theme: { borderRadius } }) => `${borderRadius.sm} 0 ${borderRadius.sm} 0`};
  background-color: ${({ theme: { colors } }) => colors.backgroundSecondary};
  color: ${({ theme: { colors } }) => colors.textDimmed};
  font-size: 12px;
  line-height: 12px;
`;

export function useCharacterLimit(value: UseCharacterLimitProps) {
  const [current, setCurrent] = useState(String(value || "").length);

  useEffect(() => {
    setCurrent(String(value || "").length);
  }, [value]);

  return { current };
}

function CharacterLimit({ current, max, ...props }: CharacterLimitProps) {
  if (Number(max) === 0) return null;

  return (
    <Label {...props}>
      {current}/{max}
    </Label>
  );
}

export default CharacterLimit;
