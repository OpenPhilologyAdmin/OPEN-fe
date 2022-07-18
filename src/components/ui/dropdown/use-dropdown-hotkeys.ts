import { RefObject, useCallback, useEffect } from "react";

const INPUT_SELECTOR = '[type="checkbox"], [type="radio"]';

/**
 * Custom hook that handles keyboard interactions with focused (opened or closed) dropdown.
 * It is not intended to be used within a Dropdown component since it's pretty tightly coupled with it's implementation.
 *
 * @param wrapperRef Dropdown component ref
 * @param isOpen Dropdown component state (open/closed)
 * @param openDropdown Dropdown opening callback
 * @param closeDropdown Dropdown closing callback
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#keyboard_interactions
 */
function useDropdownHotkeys(
  wrapperRef: RefObject<HTMLElement>,
  isOpen: boolean,
  openDropdown: () => void,
  closeDropdown: () => void,
) {
  const focusNext = useCallback(() => {
    const inputs = [
      ...(wrapperRef.current?.querySelectorAll(INPUT_SELECTOR) as NodeListOf<HTMLInputElement>),
    ];
    const focusedInputIndex = inputs.findIndex(input => input === document.activeElement);

    if (focusedInputIndex === inputs.length - 1) {
      inputs[0]?.focus();
    } else {
      inputs[focusedInputIndex + 1]?.focus();
    }
  }, [wrapperRef]);
  const focusPrev = useCallback(() => {
    const inputs = [
      ...(wrapperRef.current?.querySelectorAll(INPUT_SELECTOR) as NodeListOf<HTMLInputElement>),
    ];
    const focusedInputIndex = inputs.findIndex(input => input === document.activeElement);

    if (focusedInputIndex === 0) {
      inputs[inputs.length - 1]?.focus();
    } else {
      inputs[focusedInputIndex - 1]?.focus();
    }
  }, [wrapperRef]);

  const handleKeyBindings = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen) {
        switch (event.code) {
          case "Escape":
            closeDropdown();
            break;
          case "Tab":
            event.preventDefault();
            closeDropdown();
            break;
          case "ArrowDown":
            event.preventDefault();
            focusNext();
            break;
          case "ArrowUp":
            event.preventDefault();
            focusPrev();
            break;
        }
      } else {
        if (event.code === "Space" && document.activeElement === wrapperRef.current) {
          openDropdown();
        }
      }
    },
    [wrapperRef, isOpen, openDropdown, closeDropdown, focusPrev, focusNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyBindings);

    return () => {
      document.removeEventListener("keydown", handleKeyBindings);
    };
  }, [isOpen, handleKeyBindings]);
}

export default useDropdownHotkeys;
