import { ChangeEventHandler, ComponentPropsWithRef, useEffect, useRef } from "react";

import Checkbox from "@/components/ui/checkbox";
import Radio from "@/components/ui/radio";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

export type OptionValue = string | number;

export type DropdownOption = {
  label: string;
  value?: OptionValue;
  selected?: boolean;
};

export type NormalizedDropdownOption = DropdownOption & {
  value: OptionValue;
  selected: boolean;
};

export type DropdownItemProps = DropdownOption & {
  name: string;
  multiple: boolean;
  focused: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const ItemWrapper = styled.label<ComponentPropsWithRef<"label">>`
  padding: 6px 16px;
  display: flex;
  column-gap: 8px;

  cursor: pointer;
`;

const Label = styled(Typography).attrs(() => ({ variant: "body-regular" }))`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function DropdownItem({
  name,
  multiple,
  label,
  value,
  selected,
  focused,
  onChange,
}: DropdownItemProps) {
  const id = `${name}-${label}-${value}`;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
    }
  }, [focused]);

  const InputComponent = multiple ? Checkbox : Radio;

  return (
    <ItemWrapper role="option" aria-selected={selected} htmlFor={id} title={label}>
      <InputComponent
        ref={inputRef}
        type={multiple ? "checkbox" : "radio"}
        name={name}
        label={<Label>{label}</Label>}
        id={id}
        checked={selected}
        onChange={onChange}
      />
    </ItemWrapper>
  );
}

export default DropdownItem;
