import React, {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import ArrowDownIcon from "@/assets/images/icons/chevron-small-down.svg";
import DropdownItem, {
  DropdownItemProps,
  DropdownOption,
  NormalizedDropdownOption,
  OptionValue,
} from "@/components/dropdown/item";
import useDropdownHotkeys from "@/components/dropdown/use-dropdown-hotkeys";
import Typography from "@/components/typography";
import useOutsideClickListener from "@/hooks/use-outside-click-listener";
import { joinDropdownChoices } from "@/utils/join-dropdown-choices";
import styled from "styled-components";

type DropdownItemType = React.ReactComponentElement<typeof DropdownItem, DropdownItemProps>;

type DropdownProps = {
  label: string;
  prompt?: string;
  multiple?: boolean;
  onChange?: (selectedOptions: OptionValue[]) => void;
  children: DropdownItemType[];
};

type DropdownValueProps = ComponentPropsWithoutRef<"div"> & {
  visible: boolean;
};

type DropdownOptionsProps = ComponentPropsWithoutRef<"div"> & {
  open: boolean;
};

const borderWidth = 1;

const DropdownWrapper = styled.div<ComponentPropsWithRef<"div">>`
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-block-start: 2px;
  padding: 12px 16px;
  gap: 12px;

  background: ${props => props.theme.colors.backgroundPrimary};
  border: ${borderWidth}px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  user-select: none;

  &:focus-visible {
    outline-color: ${props => props.theme.colors.focus};
  }
`;

const DropdownLabel = styled(Typography).attrs({ as: "label", variant: "body-bold" })`
  position: absolute;
  top: -15px;
  left: 8px;
  padding-inline: 8px;
  background: ${props => props.theme.colors.backgroundPrimary};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  white-space: nowrap;
  cursor: pointer;
`;

const DropdownValue = styled(Typography).attrs({
  as: "div",
  variant: "body-regular",
})<DropdownValueProps>`
  visibility: ${props => (props.visible ? "visible" : "hidden")};

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const DropdownOptions = styled.div<DropdownOptionsProps>`
  display: ${props => (props.open ? "flex" : "none")};
  position: absolute;
  top: -${borderWidth}px;
  right: -${borderWidth}px;
  left: -${borderWidth}px;
  padding-block: 11px 7px;
  max-height: 70vh;
  flex-direction: column;
  border-radius: inherit;
  border: inherit;
  background: inherit;
  overflow-y: auto;
  z-index: 1;

  & + ${DropdownLabel} {
    z-index: ${props => (props.open ? 1 : "auto")};
  }
`;

const DropdownArrow = styled(ArrowDownIcon)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: grid;
  place-content: center;
`;

// index that cannot occur in the options array to reset focused element
const NO_OPTION_INDEX = -1;

function Dropdown({ label, multiple, prompt, onChange, children }: DropdownProps) {
  const collectOptions: () => NormalizedDropdownOption[] = () => {
    const reactElements = React.Children.toArray(children).filter(child =>
      React.isValidElement(child),
    ) as React.ReactElement[];

    return reactElements.map(
      child =>
        ({
          label: child.props.label,
          value: child.props.value || child.props.label,
          selected: Boolean(child.props.selected),
        } as NormalizedDropdownOption),
    );
  };

  const mounted = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const inputName = useId();
  const [focusedOption, setFocusedOption] = useState(NO_OPTION_INDEX);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<NormalizedDropdownOption[]>(collectOptions());

  const findFirstSelectedIndex = useCallback(() => {
    const index = options.findIndex(options => options.selected);

    return index > -1 ? index : 0;
  }, [options]);

  const openDropdown = () => {
    setIsOpen(true);

    setFocusedOption(findFirstSelectedIndex());
  };

  const closeDropdown = () => {
    setIsOpen(false);

    setFocusedOption(NO_OPTION_INDEX);

    wrapperRef.current?.focus();
  };

  const outsideClickCallback = () => {
    if (!mounted.current || !isOpen) return;

    closeDropdown();
  };

  const onSelectionChange = (optionIndex: number, selectionState: boolean) => {
    setOptions(current =>
      current.map((item, index) => {
        if (!multiple) item.selected = false;

        if (index === optionIndex) item.selected = !multiple || selectionState;

        return item;
      }),
    );
  };

  useEffect((): (() => void) => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(options.filter(option => Boolean(option.selected)).map(option => option.value));
    }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  useOutsideClickListener(wrapperRef, outsideClickCallback);
  useDropdownHotkeys(wrapperRef, isOpen, openDropdown, closeDropdown);

  return (
    <DropdownWrapper
      tabIndex={0}
      ref={wrapperRef}
      onClick={() => {
        if (!isOpen) openDropdown();
      }}
      data-testid="dropdown-wrapper"
    >
      <DropdownValue visible={!isOpen}>
        {joinDropdownChoices(options, prompt || "Select")}
      </DropdownValue>
      <DropdownOptions
        open={isOpen}
        role="listbox"
        aria-multiselectable={multiple}
        aria-labelledby={labelId}
        aria-hidden={isOpen}
      >
        {React.Children.map(children, (option, index) => (
          <>
            {React.isValidElement(option) && (
              <DropdownItem
                {...(option.props as DropdownItemProps)}
                name={inputName}
                multiple={!!multiple}
                focused={index === focusedOption}
                selected={options[index]?.selected}
                onChange={event => {
                  onSelectionChange(index, event.target.checked);

                  if (!multiple) closeDropdown();
                }}
              />
            )}
          </>
        ))}
      </DropdownOptions>
      <DropdownLabel id={labelId}>{label}</DropdownLabel>
      <DropdownArrow />
    </DropdownWrapper>
  );
}

// Create different public interface for DropdownItem to allow user to skip some args
//  that will be later on added by Dropdown component when iterating over children
//  This way component typing can be stronger when the public interface for the item is not so demanding :)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DropdownItemInterface(_props: DropdownOption) {
  return null;
}

// Export public interface of DropdownItem
export { DropdownItemInterface as DropdownItem };
export default Dropdown;
