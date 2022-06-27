import { useRef } from "react";

import { render, screen, userEvent } from "@/utils/test-utils";

import useOutsideClickListener from "../use-outside-click-listener";

const mockCallback = jest.fn();

function TestComponent() {
  const wrapperRef = useRef(null);

  useOutsideClickListener(wrapperRef, mockCallback);

  return (
    <div ref={wrapperRef}>
      <button name="internal-button">Internal button</button>
    </div>
  );
}

function ExternalComponent() {
  return <button name="external-button">External button</button>;
}

describe("listens for clicks", () => {
  let internalButton: HTMLElement, externalButton: HTMLElement;
  const user = userEvent.setup();

  beforeEach(() => {
    mockCallback.mockReset();

    render(
      <>
        <TestComponent />
        <ExternalComponent />
      </>,
    );

    internalButton = screen.getByText(/Internal button/i);
    externalButton = screen.getByText(/External button/i);
  });

  describe("when clicked inside", () => {
    beforeEach(async () => {
      await user.click(internalButton);
    });

    it("does not trigger callback", () => {
      expect(mockCallback.mock.calls.length).toEqual(0);
    });
  });

  describe("when clicked outside", () => {
    beforeEach(async () => {
      await user.click(externalButton);
    });

    it("triggers callback", () => {
      expect(mockCallback.mock.calls.length).toEqual(1);
    });
  });
});
