import { useRef } from "react";

import useDropdownHotkeys from "@/components/dropdown/use-dropdown-hotkeys";
import { render, screen, userEvent } from "@/utils/test-utils";

const mockOpenCallback = jest.fn();
const mockCloseCallback = jest.fn();
let isOpen: boolean;

function TestComponent() {
  const wrapperRef = useRef(null);

  useDropdownHotkeys(wrapperRef, isOpen, mockOpenCallback, mockCloseCallback);

  return (
    <div ref={wrapperRef} data-testid="wrapper" tabIndex={0}>
      <input type="checkbox" data-testid="checkbox1" />
      <input type="checkbox" data-testid="checkbox2" />
      <input type="checkbox" data-testid="checkbox3" />
    </div>
  );
}

describe("listens for keyboard input", () => {
  let wrapper: HTMLElement, input: HTMLElement;
  const user = userEvent.setup();

  beforeEach(() => {
    mockOpenCallback.mockReset();
    mockCloseCallback.mockReset();

    render(
      <>
        <TestComponent />
        <input type="text" data-testid="input" /> {/* focusable element */}
      </>,
    );
    wrapper = screen.getByTestId("wrapper");
    input = screen.getByTestId("input");
  });

  describe("when isOpen = false", () => {
    beforeAll(() => {
      isOpen = false;
    });

    describe("when wrapper is focused", () => {
      beforeEach(() => {
        wrapper.focus();
      });

      it("calls open callback when space is pressed", () => {
        user.keyboard("[Space]");
        expect(mockOpenCallback.mock.calls.length).toEqual(1);
      });

      it("does not call open callback when non-space is pressed", () => {
        user.keyboard("[Shift][Control][OSLeft][Enter]");
        expect(mockOpenCallback.mock.calls.length).toEqual(0);
      });

      it("changes focused element when tab is pressed", () => {
        user.keyboard("[Tab]");
        expect(document.activeElement).not.toEqual(wrapper);
      });
    });

    describe("when wrapper is not focused", () => {
      beforeEach(() => {
        input.focus();
      });

      it("does not call open callback when space is pressed", () => {
        user.keyboard("[Space]");
        expect(mockOpenCallback.mock.calls.length).toEqual(0);
      });

      it("does not call open callback when non-space is pressed", () => {
        user.keyboard("[Shift][Ctrl][Cmd][Enter]");
        expect(mockOpenCallback.mock.calls.length).toEqual(0);
      });

      it("changes focused element when tab is pressed", () => {
        user.keyboard("[Tab]");
        expect(document.activeElement).not.toEqual(input);
      });
    });
  });

  describe("when isOpen = true", () => {
    beforeAll(() => {
      isOpen = true;
    });

    describe("when Escape is pressed", () => {
      beforeEach(() => {
        user.keyboard("[Escape]");
      });

      it("calls close callback", () => {
        expect(mockCloseCallback.mock.calls.length).toEqual(1);
      });
    });

    describe("when Tab is pressed", () => {
      beforeEach(() => {
        wrapper.focus();
        user.keyboard("[Tab]");
      });

      it("calls close callback", () => {
        expect(mockCloseCallback.mock.calls.length).toEqual(1);
      });

      it("prevents focus change", () => {
        expect(document.activeElement).toEqual(wrapper);
      });
    });

    describe("when ArrowDown is pressed", () => {
      describe("when first item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox1").focus();
          user.keyboard("[ArrowDown]");
        });

        it("focuses second item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox2"));
        });
      });

      describe("when second item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox2").focus();
          user.keyboard("[ArrowDown]");
        });

        it("focuses third item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox3"));
        });
      });

      describe("when last item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox3").focus();
          user.keyboard("[ArrowDown]");
        });

        it("focuses first item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox1"));
        });
      });
    });

    describe("when ArrowUp is pressed", () => {
      describe("when first item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox1").focus();
          user.keyboard("[ArrowUp]");
        });

        it("focuses last item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox3"));
        });
      });

      describe("when second item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox2").focus();
          user.keyboard("[ArrowUp]");
        });

        it("focuses first item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox1"));
        });
      });

      describe("when last item is focused", () => {
        beforeEach(() => {
          screen.getByTestId("checkbox3").focus();
          user.keyboard("[ArrowUp]");
        });

        it("focuses second item", () => {
          expect(document.activeElement).toEqual(screen.getByTestId("checkbox2"));
        });
      });
    });
  });
});
