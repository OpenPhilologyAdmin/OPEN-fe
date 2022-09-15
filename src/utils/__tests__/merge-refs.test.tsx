import { forwardRef, useImperativeHandle } from "react";

import { render } from "@/utils/test-utils";

import { mergeRefs } from "../merge-refs";

const refValue = "refValue";
const refFunction = jest.fn();
const refObject = { current: undefined };

const Dummy = forwardRef(function Dummy(_, ref) {
  useImperativeHandle(ref, () => refValue);

  return null;
});

function Example({ visible }: { visible?: boolean }) {
  return visible ? <Dummy ref={mergeRefs(refObject, refFunction)} /> : null;
}

test("mergeRefs", () => {
  const { rerender } = render(<Example visible />);

  expect(refFunction).toHaveBeenCalledTimes(1);
  expect(refFunction).toHaveBeenCalledWith(refValue);
  expect(refObject.current).toBe(refValue);

  rerender(<Example visible={false} />);

  expect(refFunction).toHaveBeenCalledTimes(2);
  expect(refFunction).toHaveBeenCalledWith(null);
  expect(refObject.current).toBe(null);
});
